#!/usr/bin/env python3
"""
Fish Audio text-to-speech for TransHorizons country reports.

Takes a plain-text file (one report section, e.g. the Baseline) and writes an MP3.

Usage
-----
  python scripts/fish_tts.py scripts/tts-samples/can-baseline-fr.txt --lang fr -o tts-out/can-baseline-fr.mp3

Setup
-----
  pip install requests
  set FISH_API_KEY (see README block at the bottom of this file)

Design notes
------------
* Talks to the REST API directly with `requests` rather than `fish-audio-sdk`:
  the model is selected by an HTTP *header*, and the SDK's `backend` argument
  still defaults to the legacy "speech-1.5". One dependency, exact control.
* The 500-character cap is a limitation of the *free web player*, not the API.
  This script sends the whole section in ONE request. Splitting only engages
  if the text exceeds MAX_REQUEST_BYTES, and then only on sentence boundaries.
* There is no `language` field in the TTS API. Fish infers the spoken language
  from the text itself and the voice. `--lang` therefore selects the VOICE and
  labels the output; it is not sent to the API.
"""

from __future__ import annotations

import argparse
import hashlib
import os
import re
import sys
import time
from pathlib import Path

try:
    import requests
except ImportError:  # pragma: no cover
    sys.exit("Missing dependency. Run:  pip install requests")


# ---------------------------------------------------------------------------
# CONFIG — the knobs you are most likely to change
# ---------------------------------------------------------------------------

# "s2.1-pro-free" = same model quality, no character cap, fair-use governed, $0.
# Switch to "s2.1-pro" for production. That is the one-line change.
MODEL = "s2.1-pro-free"

# Voice reference IDs, per language. Fill these in once (see --find-voice).
VOICE_IDS = {
    "en": "bf322df2096a46f18c579d0baa36f41d",  # Adrian (en) — confirmed by ear 2026-08-12
    "fr": "c51f4c0e9e414d9eaf7c71effd5b92d2",  # angelokyly (fr) — confirmed by ear 2026-08-12
}

# ---------------------------------------------------------------------------
# SPOKEN-TEXT SUBSTITUTIONS
#
# Applied to the text on its way to Fish Audio. THE SOURCE YAML IS NEVER
# TOUCHED — this only changes what the engine hears, never what a reader sees.
# Add a row when you catch a mispronunciation; delete a row to undo it.
# `--raw` disables the whole layer for A/B testing.
#
# Each entry is (regex pattern, replacement, why).
# ---------------------------------------------------------------------------

SUBSTITUTIONS = {
    "fr": [
        # "est" as a compass point is /ɛst/, but hyphenated before another
        # direction the model reads it as the verb "est" /ɛ/. A trailing "e"
        # makes it a pronounceable syllable and restores the compass reading.
        # Verified by ear 2026-08-12: the real verb "est" is unaffected.
        (r'\bEst-(ouest|Ouest)\b', r'Este-\1', 'compass point, capitalised'),
        (r'\best-(ouest|Ouest)\b', r'este-\1', 'compass point'),
        (r'\bOuest-est\b', 'Ouest-este', 'compass point, reversed'),
        (r'\bouest-est\b', 'ouest-este', 'compass point, reversed'),
    ],
    "en": [
        # Nothing needed so far — English reads figures and dates correctly
        # with normalize on. Add rows here if you catch something.
    ],
}

# Month names for turning ISO dates into spoken dates.
MONTHS = {
    "fr": ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
           "août", "septembre", "octobre", "novembre", "décembre"],
    "en": ["January", "February", "March", "April", "May", "June", "July",
           "August", "September", "October", "November", "December"],
}

# Billing is per UTF-8 byte, not per character. Accents cost 2 bytes each,
# so French runs roughly 3-5% more expensive than the same text in English.
PRICE_PER_MILLION_BYTES_USD = 15.00
FREE_MODELS = {"s2.1-pro-free"}

API_BASE = "https://api.fish.audio"
TTS_URL = f"{API_BASE}/v1/tts"
MODEL_LIST_URL = f"{API_BASE}/model"

# No per-request maximum is documented. This is a self-imposed safety ceiling,
# well above any single report section, so normal runs are a single request.
MAX_REQUEST_BYTES = 60_000

# Generation temperature, per language. Lower is steadier prosody, less
# expressive. French sits low because at 0.7 the engine occasionally inserts a
# hesitation inside spelled-out numbers ("quarante … et un virgule cinq");
# 0.3 reduces it. English was clean at 0.7, so it keeps the livelier setting.
# Verified by ear 2026-08-12. Override per run with --temperature.
TEMPERATURE = {"en": 0.7, "fr": 0.3}

MP3_BITRATE = 128          # 64 | 128 | 192
CHUNK_LENGTH = 300         # 100-300; how much text the engine batches internally
NORMALIZE = True           # expands numbers and dates for natural reading
# (connect, read). The read side is generous on purpose: a 26k-character report
# section takes many minutes to synthesise, and waiting is better than splitting
# it, because every split is an MP3 join and a potential audible seam.
REQUEST_TIMEOUT = (10, 1800)
MAX_RETRIES = 4


# ---------------------------------------------------------------------------
# Spoken-text preparation
# ---------------------------------------------------------------------------

# YYYY-MM-DD only. A year range like "2026-2027" cannot match, because the
# month and day groups are exactly two digits each.
_ISO_DATE = re.compile(r'\b(\d{4})-(\d{2})-(\d{2})\b')


def expand_iso_dates(text: str, lang: str) -> tuple[str, int]:
    """
    Rewrite ISO dates into the spoken form of the target language.
    2026-07-25 -> "25 juillet 2026" (fr) / "July 25, 2026" (en)

    ISO is a storage format, not a spoken one. French in particular reads
    day-month-year, so the raw ISO string comes out as digits and dashes.
    """
    months = MONTHS.get(lang)
    if not months:
        return text, 0

    count = 0

    def replace(match: re.Match) -> str:
        nonlocal count
        year, month, day = (int(g) for g in match.groups())
        if not (1 <= month <= 12 and 1 <= day <= 31):
            return match.group(0)  # not a date, leave it alone
        count += 1
        if lang == "fr":
            # French says "1er" for the first of the month, plain numeral after.
            spoken_day = "1er" if day == 1 else str(day)
            return f"{spoken_day} {months[month - 1]} {year}"
        return f"{months[month - 1]} {day}, {year}"

    return _ISO_DATE.sub(replace, text), count


def prepare_spoken_text(text: str, lang: str, verbose: bool = True) -> str:
    """Apply the substitution table and date expansion. Never touches source files."""
    changes: list[str] = []

    text, dates = expand_iso_dates(text, lang)
    if dates:
        changes.append(f"{dates} ISO date{'s' if dates > 1 else ''} spoken out")

    for pattern, replacement, why in SUBSTITUTIONS.get(lang, []):
        text, hits = re.subn(pattern, replacement, text)
        if hits:
            changes.append(f"{hits}x {why}")

    if verbose and changes:
        print(f"  spoken-text: {', '.join(changes)}")
    elif verbose:
        print("  spoken-text: no substitutions needed")

    return text


# ---------------------------------------------------------------------------
# Sentence-aware splitting
# ---------------------------------------------------------------------------

# Words that end in a period without ending a sentence.
_ABBREVIATIONS = {
    # French
    "m", "mm", "mme", "mmes", "mlle", "dr", "dre", "pr", "me", "av", "apr",
    "env", "ex", "cf", "etc", "art", "chap", "fig", "p", "pp", "vol", "no",
    "nos", "réf", "ref", "éd", "ed", "trad", "j.-c",
    # English
    "mr", "mrs", "ms", "prof", "st", "jr", "sr", "inc", "ltd", "co", "corp",
    "approx", "est", "vs", "al", "eg", "ie", "e.g", "i.e", "u.s", "u.k",
    "fig", "figs", "sec", "para", "ch",
}

# A candidate break: after . ! ? …, optionally through closing quotes/brackets,
# followed by whitespace. A decimal like "41.5" never matches — no space after.
_CANDIDATE = re.compile(r'(?<=[.!?…])["»”’\')\]]*(?=\s)')

# The token immediately preceding the break.
_TRAILING_WORD = re.compile(r'([\w.\-·]+)[."»”’\')\]]*$', re.UNICODE)


def _is_real_boundary(text: str, pos: int) -> bool:
    """Reject breaks that fall inside an abbreviation or a numbered initial."""
    head = text[:pos]
    match = _TRAILING_WORD.search(head)
    if not match:
        return True
    word = match.group(1).rstrip(".").lower()
    if word in _ABBREVIATIONS:
        return False
    # A single letter before a period is an initial: "J. Trudeau", "P. Kelly".
    if len(word) == 1 and word.isalpha():
        return False
    # Ordinals and bare numbers: "1. " in a list, "art. 35."
    if word.isdigit():
        return False
    return True


def split_sentences(text: str) -> list[str]:
    """Split into sentences, never mid-sentence. Blank lines end a sentence."""
    sentences: list[str] = []
    for block in re.split(r'\n\s*\n', text):
        block = block.strip()
        if not block:
            continue
        start = 0
        for match in _CANDIDATE.finditer(block):
            pos = match.end()
            if not _is_real_boundary(block, pos):
                continue
            piece = block[start:pos].strip()
            if piece:
                sentences.append(piece)
            start = pos
        tail = block[start:].strip()
        if tail:
            sentences.append(tail)
    return sentences


def group_into_requests(text: str, max_bytes: int) -> list[str]:
    """
    Return the batches to send. One batch if the text fits, which is the
    normal case. Sentences are never broken apart.
    """
    if len(text.encode("utf-8")) <= max_bytes:
        return [text]

    batches: list[str] = []
    current: list[str] = []
    current_bytes = 0

    for sentence in split_sentences(text):
        size = len(sentence.encode("utf-8")) + 1
        if size > max_bytes:
            # A single sentence over budget. Send it whole regardless: breaking
            # it would put a false pause inside the sentence, which is exactly
            # what we are avoiding.
            if current:
                batches.append(" ".join(current))
                current, current_bytes = [], 0
            print(
                f"  ! one sentence is {size:,} bytes, over the "
                f"{max_bytes:,} ceiling — sending it unsplit",
                file=sys.stderr,
            )
            batches.append(sentence)
            continue
        if current_bytes + size > max_bytes:
            batches.append(" ".join(current))
            current, current_bytes = [], 0
        current.append(sentence)
        current_bytes += size

    if current:
        batches.append(" ".join(current))
    return batches


# ---------------------------------------------------------------------------
# MP3 joining
# ---------------------------------------------------------------------------

def _strip_id3(data: bytes) -> bytes:
    """Remove ID3v2 header and ID3v1 trailer so joined parts play cleanly."""
    if data[:3] == b"ID3" and len(data) > 10:
        # Size is four sync-safe bytes (7 bits each).
        size = 0
        for byte in data[6:10]:
            size = (size << 7) | (byte & 0x7F)
        data = data[10 + size:]
    if data[-128:][:3] == b"TAG":
        data = data[:-128]
    return data


def join_mp3(parts: list[bytes]) -> bytes:
    if len(parts) == 1:
        return parts[0]
    joined = [parts[0]]
    joined.extend(_strip_id3(part) for part in parts[1:])
    return b"".join(joined)


# ---------------------------------------------------------------------------
# API
# ---------------------------------------------------------------------------

class FishError(RuntimeError):
    pass


def get_api_key() -> str:
    key = os.environ.get("FISH_API_KEY", "").strip()
    if not key:
        raise FishError(
            "FISH_API_KEY is not set.\n"
            "  PowerShell (permanent):  setx FISH_API_KEY \"your_key_here\"\n"
            "  then open a NEW terminal.\n"
            "Create a key at https://fish.audio/app/api-keys"
        )
    return key


def _explain_http_error(status: int, body: str) -> str:
    snippet = body.strip()[:400]
    if status in (401, 403):
        return (
            f"Authentication failed (HTTP {status}). Your FISH_API_KEY is missing, "
            f"mistyped, expired, or revoked.\nCheck it at "
            f"https://fish.audio/app/api-keys\nServer said: {snippet}"
        )
    if status == 402:
        return (
            f"Payment required (HTTP {status}). The account has no credit for a paid "
            f"model.\nEither top up, or set MODEL = 's2.1-pro-free'.\n"
            f"Server said: {snippet}"
        )
    if status == 429:
        return (
            f"Rate limited / fair-use ceiling hit (HTTP {status}).\n"
            f"'s2.1-pro-free' is governed by a fair-use policy with no published "
            f"per-minute number, so this means: slow down, or move to the paid "
            f"'s2.1-pro' for a production run.\nServer said: {snippet}"
        )
    if status == 404:
        return (
            f"Not found (HTTP {status}). Usually a bad voice reference_id — check it "
            f"with:  python scripts/fish_tts.py --find-voice \"Adrian\"\n"
            f"Server said: {snippet}"
        )
    if status == 422:
        return (
            f"The API rejected the request body (HTTP {status}). Often an unknown "
            f"model name in the header.\nServer said: {snippet}"
        )
    return f"HTTP {status} from Fish Audio.\nServer said: {snippet}"


def synthesize(text: str, voice_id: str, model: str, api_key: str,
               normalize: bool, bitrate: int, speed: float,
               temperature: float = 0.7) -> bytes:
    payload = {
        "text": text,
        "reference_id": voice_id,
        "format": "mp3",
        "mp3_bitrate": bitrate,
        "chunk_length": CHUNK_LENGTH,
        "normalize": normalize,
        "latency": "normal",
        "temperature": temperature,
    }
    if speed != 1.0:
        payload["prosody"] = {"speed": speed}

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "model": model,  # the model goes in the HEADER, not the body
    }

    last_error = ""
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = requests.post(
                TTS_URL, json=payload, headers=headers, timeout=REQUEST_TIMEOUT
            )
        except requests.exceptions.Timeout:
            last_error = "request timed out"
        except requests.exceptions.ConnectionError as exc:
            last_error = f"connection error: {exc}"
        else:
            if response.status_code == 200:
                if not response.content:
                    raise FishError("Fish returned an empty audio body.")
                return response.content
            # Retry transient failures only.
            if response.status_code in (429, 500, 502, 503, 504):
                last_error = _explain_http_error(response.status_code, response.text)
                if attempt < MAX_RETRIES:
                    wait = float(response.headers.get("Retry-After", 2 ** attempt))
                    print(
                        f"  … HTTP {response.status_code}, retrying in {wait:.0f}s "
                        f"({attempt}/{MAX_RETRIES - 1})",
                        file=sys.stderr,
                    )
                    time.sleep(wait)
                    continue
                raise FishError(last_error)
            raise FishError(_explain_http_error(response.status_code, response.text))

        if attempt < MAX_RETRIES:
            wait = 2 ** attempt
            print(f"  … {last_error}, retrying in {wait}s", file=sys.stderr)
            time.sleep(wait)

    raise FishError(f"Gave up after {MAX_RETRIES} attempts. Last error: {last_error}")


def find_voice(query: str, api_key: str) -> None:
    """Look up voice reference IDs by name."""
    try:
        response = requests.get(
            MODEL_LIST_URL,
            params={"title": query, "page_size": 20, "page_number": 1},
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=REQUEST_TIMEOUT,
        )
    except requests.exceptions.RequestException as exc:
        raise FishError(f"Could not reach Fish Audio: {exc}")

    if response.status_code != 200:
        raise FishError(_explain_http_error(response.status_code, response.text))

    items = response.json().get("items", [])
    if not items:
        print(f'No voices matched "{query}".')
        print("Browse https://fish.audio/voice-library/ and try the exact title.")
        return

    print(f'Voices matching "{query}":\n')
    for item in items:
        title = item.get("title", "?")
        languages = item.get("languages") or item.get("language") or []
        if isinstance(languages, str):
            languages = [languages]
        tag = f"  [{', '.join(languages)}]" if languages else ""
        print(f"  {item.get('_id') or item.get('id')}   {title}{tag}")
    print("\nPaste the ID into VOICE_IDS at the top of this script.")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def report_cost(text: str, model: str) -> int:
    byte_count = len(text.encode("utf-8"))
    cost = byte_count / 1_000_000 * PRICE_PER_MILLION_BYTES_USD
    print(f"  characters : {len(text):,}")
    print(f"  UTF-8 bytes: {byte_count:,}")
    if model in FREE_MODELS:
        print(f"  cost       : $0.00 on '{model}'  "
              f"(would be ${cost:.4f} at ${PRICE_PER_MILLION_BYTES_USD:.0f}/M bytes)")
    else:
        print(f"  cost       : ${cost:.4f} at ${PRICE_PER_MILLION_BYTES_USD:.0f}/M bytes")
    return byte_count


def run_manifest(manifest_path: Path, args, api_key: str) -> int:
    """
    Generate every section listed in a manifest.json from extract-narration.cjs.

    Skips a section whose MP3 already exists and whose recorded sha256 still
    matches the manifest — so a re-run after editing one section regenerates
    that section only, and costs cents rather than dollars.
    """
    import json

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    base = manifest_path.parent
    lang = manifest.get("lang", args.lang)
    voice_id = args.voice or VOICE_IDS.get(lang, "")
    temperature = (args.temperature if args.temperature is not None
                   else TEMPERATURE.get(lang, 0.7))

    out_dir = args.out or Path("tts-out") / "countries" / manifest.get("country", "") / lang
    out_dir.mkdir(parents=True, exist_ok=True)
    state_path = out_dir / "generated.json"
    state = json.loads(state_path.read_text(encoding="utf-8")) if state_path.exists() else {}

    sections = manifest["sections"]

    # What actually determines whether a recording is current is the text AS
    # SPOKEN plus the settings it was spoken with — not the source text. A
    # pronunciation fix changes no source text at all, so hashing the source
    # would skip exactly the sections the fix was meant to repair. Voice, model,
    # temperature, speed and bitrate are folded in for the same reason.
    def generation_key(spoken: str) -> str:
        digest = hashlib.sha256(spoken.encode("utf-8"))
        digest.update(f"|{voice_id}|{args.model}|{temperature}|{args.speed}"
                      f"|{args.bitrate}|{not args.no_normalize}".encode("utf-8"))
        return digest.hexdigest()

    prepared, keys = {}, {}
    for section in sections:
        text = (base / section["text"]).read_text(encoding="utf-8").strip()
        if not args.raw:
            text = prepare_spoken_text(text, lang, verbose=False)
        prepared[section["id"]] = text
        keys[section["id"]] = generation_key(text)

    # Migration: earlier runs stored the source-text hash. Where that matches and
    # the MP3 exists, the file was made from this same text with these defaults,
    # so adopt it rather than regenerating ~2 hours of audio for a format change.
    for section in sections:
        if state.get(section["id"]) == section["sha256"] and (out_dir / section["mp3"]).exists():
            state[section["id"]] = keys[section["id"]]

    pending = [s for s in sections
               if not (out_dir / s["mp3"]).exists() or state.get(s["id"]) != keys[s["id"]]]

    total_bytes = sum(s["bytes"] for s in pending)
    cost = total_bytes / 1_000_000 * PRICE_PER_MILLION_BYTES_USD
    print(f"\n{manifest_path}")
    print(f"  model      : {args.model}")
    print(f"  voice      : {voice_id}  [{lang}]")
    print(f"  temperature: {temperature}")
    print(f"  sections   : {len(pending)} to generate, "
          f"{len(sections) - len(pending)} already current")
    print(f"  UTF-8 bytes: {total_bytes:,}")
    if args.model in FREE_MODELS:
        print(f"  cost       : $0.00 on '{args.model}'  (would be ${cost:.2f})")
    else:
        print(f"  cost       : ${cost:.2f}")

    if args.dry_run:
        print("\n  dry run — nothing sent.\n")
        return 0
    if not pending:
        print("\n  Everything is current.\n")
        return 0

    started = time.monotonic()
    for index, section in enumerate(pending, start=1):
        text = prepared[section["id"]]
        batches = group_into_requests(text, args.max_bytes)
        print(f"  [{index}/{len(pending)}] {section['id']:<10} "
              f"{section['chars']:>7,} ch  ({len(batches)} request"
              f"{'s' if len(batches) > 1 else ''})", flush=True)
        parts = [synthesize(b, voice_id, args.model, api_key,
                            normalize=not args.no_normalize, bitrate=args.bitrate,
                            speed=args.speed, temperature=temperature)
                 for b in batches]
        (out_dir / section["mp3"]).write_bytes(join_mp3(parts))
        # Record the hash only after a successful write, so an interrupted run
        # resumes rather than silently leaving a section unspoken.
        state[section["id"]] = keys[section["id"]]
        state_path.write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")

    elapsed = time.monotonic() - started
    size = sum(f.stat().st_size for f in out_dir.glob("*.mp3")) / 1024 / 1024
    print(f"\n  wrote {len(pending)} file(s) to {out_dir}  "
          f"({size:.0f} MB total, {elapsed / 60:.1f} min)\n")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Fish Audio TTS for TransHorizons country reports.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("input", nargs="?", type=Path,
                        help="path to a UTF-8 .txt file (one report section)")
    parser.add_argument("-o", "--out", type=Path,
                        help="output .mp3 path (default: tts-out/<input>.mp3)")
    parser.add_argument("--lang", choices=sorted(VOICE_IDS), default="en",
                        help="selects the voice (default: en)")
    parser.add_argument("--voice", help="voice reference_id, overrides --lang")
    parser.add_argument("--model", default=MODEL, help=f"default: {MODEL}")
    parser.add_argument("--speed", type=float, default=1.0,
                        help="0.5-2.0, default 1.0")
    parser.add_argument("--bitrate", type=int, choices=[64, 128, 192],
                        default=MP3_BITRATE)
    parser.add_argument("--max-bytes", type=int, default=MAX_REQUEST_BYTES,
                        help=f"split ceiling (default: {MAX_REQUEST_BYTES:,})")
    parser.add_argument("--no-normalize", action="store_true",
                        help="disable number/date expansion (for A/B testing)")
    parser.add_argument("--raw", action="store_true",
                        help="skip the spoken-text substitutions (for A/B testing)")
    parser.add_argument("--temperature", type=float, default=None,
                        help="0-1; lower is steadier prosody. Default is "
                             "per-language (see TEMPERATURE).")
    parser.add_argument("--dry-run", action="store_true",
                        help="print size and cost, send nothing")
    parser.add_argument("--find-voice", metavar="NAME",
                        help="look up voice IDs by name, then exit")
    parser.add_argument("--manifest", type=Path,
                        help="manifest.json from extract-narration.cjs: generate "
                             "every section, skipping those already current")
    args = parser.parse_args()

    # Make French text printable on a Windows console.
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except (AttributeError, OSError):
        pass

    try:
        if args.find_voice:
            find_voice(args.find_voice, get_api_key())
            return 0

        if args.manifest:
            if not args.manifest.is_file():
                raise FishError(f"No such manifest: {args.manifest}")
            return run_manifest(args.manifest, args,
                                "" if args.dry_run else get_api_key())

        if not args.input:
            parser.error("an input file is required (or use --find-voice)")
        if not args.input.is_file():
            raise FishError(f"No such file: {args.input}")

        text = args.input.read_text(encoding="utf-8").strip()
        if not text:
            raise FishError(f"{args.input} is empty.")

        voice_id = args.voice or VOICE_IDS.get(args.lang, "")
        if not args.dry_run and (not voice_id or voice_id.startswith("PASTE_")):
            raise FishError(
                f"No voice ID set for '{args.lang}'.\n"
                f"Find one with:  python scripts/fish_tts.py --find-voice \"Adrian\"\n"
                f"then paste it into VOICE_IDS at the top of {Path(__file__).name}."
            )

        out_path = args.out or Path("tts-out") / f"{args.input.stem}.mp3"

        print(f"\n{args.input}")
        print(f"  model      : {args.model}")
        print(f"  voice      : {voice_id or '(none)'}  [--lang {args.lang}]")
        temperature = (args.temperature if args.temperature is not None
                       else TEMPERATURE.get(args.lang, 0.7))

        print(f"  normalize  : {not args.no_normalize}")
        print(f"  temperature: {temperature}")
        if args.raw:
            print("  spoken-text: skipped (--raw)")
        else:
            # Done before costing, because substitutions change the byte count.
            text = prepare_spoken_text(text, args.lang)
        report_cost(text, args.model)

        if args.dry_run:
            print("\n  dry run — nothing sent.\n")
            return 0

        batches = group_into_requests(text, args.max_bytes)
        if len(batches) == 1:
            print("  requests   : 1 (whole section in one call)")
        else:
            print(f"  requests   : {len(batches)} (split on sentence boundaries)")

        api_key = get_api_key()
        parts: list[bytes] = []
        started = time.monotonic()
        for index, batch in enumerate(batches, start=1):
            if len(batches) > 1:
                print(f"  … part {index}/{len(batches)} "
                      f"({len(batch.encode('utf-8')):,} bytes)")
            parts.append(synthesize(
                batch, voice_id, args.model, api_key,
                normalize=not args.no_normalize,
                bitrate=args.bitrate,
                speed=args.speed,
                temperature=temperature,
            ))

        audio = join_mp3(parts)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_bytes(audio)

        elapsed = time.monotonic() - started
        print(f"\n  wrote {out_path}  ({len(audio) / 1024:.0f} KB, {elapsed:.1f}s)\n")
        return 0

    except FishError as exc:
        print(f"\nError: {exc}\n", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        print("\nInterrupted.\n", file=sys.stderr)
        return 130


if __name__ == "__main__":
    raise SystemExit(main())
