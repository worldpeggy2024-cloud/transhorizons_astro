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
# Two voices per language, one of each gender, so a listener chooses rather than
# inheriting the author's preference. Find IDs at fish.audio/app/m/<id>, or with
# --find-voice. All four confirmed by ear 2026-08-12.
# Shortlisted by Peggy 2026-08-12, kept broad on purpose: rotating voices
# between reports (or between report and articles) is likely better over time
# than one voice reading everything. Find IDs at fish.audio/app/m/<id>.
VOICES = {
    "en": {
        # male
        "adrian":      "bf322df2096a46f18c579d0baa36f41d",  # US — FAVOURITE
        "deep-voice":  "e422370a73e4439b8ccc10d58b78819b",  # slightly British
        "war-arsenal": "9184d174052b422d9fe2514ec0d4d095",  # US, clear
        "adam-stone":  "b82d76382a3f40139e76ffbd095da13d",  # British, more expressive
        # female
        "laura":       "e3cd384158934cc9a01029cd7d278634",  # deep — CONFIRMED female EN (2026-08-15)
        "florence":    "7cefff1c89464d7dbc412482f909ec2d",  # Florence Scovel Shinn, lighter
        "old-woman":   "7e4baf13677e4b95b5e25a60b9a717b4",  # softer
        "ogechi":      "64028e2c8f8640e6bebf4826b7dc1ebc",  # more British
        # Peggy's own cloned voice, ENGLISH model ("Friendly Storyteller"),
        # trained on English recordings. Use this and NOT the French clone for
        # English: a clone trained only on French applies French phonology to
        # English and produces a far heavier accent than she actually has.
        # One clone per language, never one clone for both.
        "peggy":       "5ef647b1e30a4165a135076f258b7f04",
        # rejected 2026-08-12 ("really not pleasant to listen to"), kept only so
        # the already-generated tts-out/**/sarah/ files stay addressable.
        "sarah":       "933563129e564b19a115bedd57b7406a",
    },
    "fr": {
        # male
        "angelokyly":    "c51f4c0e9e414d9eaf7c71effd5b92d2",  # very deep — FAVOURITE
        "le-narrateur":  "4f2a0684dd0247dda68f339738c780e6",  # slightly dramatic
        # female
        "annonce-calme": "c5ec04dcb3f5450fb93a06f510d532b7",  # Annonce Française Calme — FAVOURITE
        "ora":           "651751df29b140ab9c791aef35dc8fc2",  # articulate
        # Peggy's own cloned voice, FRENCH model ("Voix Féminine Chaleureuse").
        # Both clones are PRIVATE and reachable only with this account's key —
        # keep them private. Intended for the NOTES only: first-person pieces in
        # her own voice, while the reports keep a neutral narrator.
        "peggy":         "b31cd0e36a6d4e72864c4994cd1ec66e",
    },
}
DEFAULT_VOICE = {"en": "adrian", "fr": "angelokyly"}


def resolve_voice(lang: str, name: str | None) -> tuple[str, str]:
    """Return (voice_name, reference_id) for a language."""
    choices = VOICES.get(lang, {})
    chosen = name or DEFAULT_VOICE.get(lang, "")
    if chosen not in choices:
        raise FishError(
            f"Unknown voice '{chosen}' for '{lang}'. "
            f"Known: {', '.join(choices) or '(none)'}"
        )
    return chosen, choices[chosen]

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
        # Place name the French voice does not resolve; the trailing -e gives it
        # the final syllable it was swallowing. English reads it correctly, so
        # this is deliberately French-only.
        (r'\bSaskatchewan\b', 'Saskatchewane', 'place name'),
        # English term of art quoted inside French prose ("la théorie des
        # principales ressources (staples thesis; Innis, 1930)"). The French
        # voice reads it as French and it becomes unrecognisable; this respells
        # the English pronunciation in French orthography.
        (r'(?i)\bstaples[- ]thesis\b', 'stéïpeulz sessiss', 'English term in French'),
    ],
    "en": [
        # "kilometre" collapses to "kimeter" / "kinometer" / "kalibmeter" in
        # every English voice tested. Doubling the L forces the first syllable.
        # Found by Peggy 2026-08-12, after respelling, number spell-out, the km
        # abbreviation, sentence splitting, temperature and request length had
        # all failed — the fault is in the word, not its context. Hyphenated
        # forms ("kill-oh-meter") also work but come out over-articulated.
        # Matches the -re and -er spellings, singular and plural.
        (r'\bkilomet(?:re|er)(s?)\b', r'killometer\1', 'kilometre pronunciation'),
        (r'\bKilomet(?:re|er)(s?)\b', r'Killometer\1', 'kilometre pronunciation'),
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

# Silence spliced between paragraphs, in milliseconds. Blank lines alone were
# audible but far too short ("we end up gasping for air"). 0 disables splicing
# and sends the whole section as a single request, as before.
PARAGRAPH_PAUSE_MS = 700

# Headings. extract-narration.cjs marks them with this prefix; it is stripped
# before anything is spoken and never appears on the page. Read at body speed
# and pace they fell flat and cost intelligibility, so they are slowed slightly
# and framed by a long pause before, short pause after — the audiobook shape.
HEADING_PREFIX = "## "
HEADING_SPEED_FACTOR = 0.92
HEADING_PAUSE_BEFORE_MS = 1100
HEADING_PAUSE_AFTER_MS = 400

# 64 | 128 | 192. 64 chosen by ear 2026-08-12: indistinguishable from 128 on
# this material, and it halves both the Fly image and the listener's mobile
# data. Note this value is part of the regeneration key, so changing it marks
# every section stale — which is correct, it really is different audio.
MP3_BITRATE = 64
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
# Exact pauses
#
# Fish has no SSML <break>, and blank lines are only a hint the model may or may
# not honour — measurably, they bought very little. The reliable way to get a
# real pause is to synthesise each paragraph as its own request and splice a
# measured silence between them, which is what ffmpeg is here for.
# ---------------------------------------------------------------------------

def find_ffmpeg() -> str | None:
    import shutil
    found = shutil.which("ffmpeg")
    if found:
        return found
    # winget installs it outside PATH until the shell restarts.
    base = Path(os.environ.get("LOCALAPPDATA", "")) / "Microsoft" / "WinGet" / "Packages"
    if base.is_dir():
        for candidate in base.glob("Gyan.FFmpeg*/**/bin/ffmpeg.exe"):
            return str(candidate)
    return None


def splice_with_silence(parts: list[bytes], gaps: list[int], bitrate: int) -> bytes:
    """Concatenate MP3 parts, with gaps[i] milliseconds before parts[i + 1]."""
    import subprocess, tempfile

    ffmpeg = find_ffmpeg()
    if not ffmpeg or len(parts) < 2:
        return join_mp3(parts)

    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp)

        # One silence file per distinct duration, matching Fish's output exactly
        # (mono, 44.1 kHz) so the concat does not resample every part.
        silences: dict[int, Path] = {}
        for ms in sorted(set(gaps)):
            if ms <= 0:
                continue
            path = work / f"sil{ms}.mp3"
            subprocess.run(
                [ffmpeg, "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono",
                 "-t", f"{ms / 1000:.3f}", "-c:a", "libmp3lame",
                 "-b:a", f"{bitrate}k", str(path)],
                check=True, capture_output=True,
            )
            silences[ms] = path

        listing = []
        for index, part in enumerate(parts):
            piece = work / f"part{index:03d}.mp3"
            piece.write_bytes(part)
            if index:
                gap = gaps[index - 1]
                if gap > 0:
                    listing.append(f"file '{silences[gap].as_posix()}'")
            listing.append(f"file '{piece.as_posix()}'")

        list_file = work / "list.txt"
        list_file.write_text("\n".join(listing) + "\n", encoding="utf-8")
        out = work / "joined.mp3"
        subprocess.run(
            [ffmpeg, "-y", "-f", "concat", "-safe", "0", "-i", str(list_file),
             "-c:a", "libmp3lame", "-b:a", f"{bitrate}k", str(out)],
            check=True, capture_output=True,
        )
        return out.read_bytes()


def render(text: str, voice_id: str, model: str, api_key: str, args,
           temperature: float, pause_ms: int) -> bytes:
    """One section of audio: paragraph pauses, and headings given weight."""
    blocks = [b.strip() for b in re.split(r'\n\s*\n', text) if b.strip()]

    if pause_ms <= 0 or len(blocks) < 2 or not find_ffmpeg():
        plain = text.replace(HEADING_PREFIX, "")
        return join_mp3([
            synthesize(batch, voice_id, model, api_key,
                       normalize=not args.no_normalize, bitrate=args.bitrate,
                       speed=args.speed, temperature=temperature)
            for batch in group_into_requests(plain, args.max_bytes)
        ])

    parts: list[bytes] = []
    is_heading: list[bool] = []
    for block in blocks:
        heading = block.startswith(HEADING_PREFIX)
        spoken = block[len(HEADING_PREFIX):].strip() if heading else block
        if heading:
            # A heading with no terminal punctuation is read with continuing
            # intonation — it sounds like the first clause of the paragraph
            # rather than its title. A full stop makes the pitch fall.
            if spoken and spoken[-1] not in ".!?:":
                spoken += "."
        parts.append(synthesize(
            spoken, voice_id, model, api_key,
            normalize=not args.no_normalize, bitrate=args.bitrate,
            speed=round(args.speed * (HEADING_SPEED_FACTOR if heading else 1.0), 3),
            temperature=temperature,
        ))
        is_heading.append(heading)

    # Longer silence BEFORE a heading than after it — the standard audiobook
    # shape, which is what makes a heading read as a division of the text.
    gaps = []
    for index in range(1, len(parts)):
        if is_heading[index]:
            gaps.append(HEADING_PAUSE_BEFORE_MS)
        elif is_heading[index - 1]:
            gaps.append(HEADING_PAUSE_AFTER_MS)
        else:
            gaps.append(pause_ms)

    return splice_with_silence(parts, gaps, args.bitrate)


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
    voice_name, default_id = resolve_voice(lang, args.voice_name)
    voice_id = args.voice or default_id
    temperature = (args.temperature if args.temperature is not None
                   else TEMPERATURE.get(lang, 0.7))

    # Each voice gets its own directory, so the sets coexist and each keeps its
    # own generated.json — switching voice never invalidates the other set.
    if args.out:
        out_dir = args.out
    elif manifest.get("country"):
        out_dir = Path("tts-out") / "countries" / manifest["country"] / lang / voice_name
    else:
        out_dir = Path("tts-out") / "articles" / manifest.get("article", "") / lang / voice_name
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
                      f"|{args.bitrate}|{not args.no_normalize}"
                      f"|{args.paragraph_pause}".encode("utf-8"))
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
    print(f"  voice      : {voice_name}  [{lang}]")
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
        blocks = len([p for p in re.split(r'\n\s*\n', text) if p.strip()])
        print(f"  [{index}/{len(pending)}] {section['id']:<10} "
              f"{section['chars']:>7,} ch  ({blocks} paragraph"
              f"{'s' if blocks > 1 else ''})", flush=True)
        audio = render(text, voice_id, args.model, api_key, args,
                       temperature, args.paragraph_pause)
        (out_dir / section["mp3"]).write_bytes(audio)
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
    parser.add_argument("--lang", choices=sorted(VOICES), default="en",
                        help="selects the voice set (default: en)")
    parser.add_argument("--voice-name", help="named voice, e.g. adrian | sarah | "
                                             "angelokyly | annonce-calme")
    parser.add_argument("--voice", help="raw voice reference_id, overrides --voice-name")
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
    parser.add_argument("--paragraph-pause", type=int, default=PARAGRAPH_PAUSE_MS,
                        metavar="MS",
                        help=f"silence between paragraphs, default {PARAGRAPH_PAUSE_MS}ms; "
                             f"0 sends the section as one request (no splicing)")
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

        voice_name, default_id = resolve_voice(args.lang, args.voice_name)
        voice_id = args.voice or default_id

        out_path = args.out or Path("tts-out") / f"{args.input.stem}.mp3"

        print(f"\n{args.input}")
        print(f"  model      : {args.model}")
        print(f"  voice      : {voice_name}  [--lang {args.lang}]")
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

        paragraphs = [p for p in re.split(r'\n\s*\n', text) if p.strip()]
        spliced = args.paragraph_pause > 0 and len(paragraphs) > 1 and find_ffmpeg()
        if spliced:
            print(f"  requests   : {len(paragraphs)} paragraphs, "
                  f"{args.paragraph_pause}ms silence between")
        else:
            print("  requests   : 1 (whole section in one call)")

        api_key = get_api_key()
        started = time.monotonic()
        audio = render(text, voice_id, args.model, api_key, args,
                       temperature, args.paragraph_pause)
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
