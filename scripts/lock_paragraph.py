#!/usr/bin/env python3
"""Lock a paragraph's approved audio so it can never be re-recorded.

    python scripts/lock_paragraph.py countries/CAN/fr --alternate "reflechie|flork" \
        --where "Le pays a produit 623 térawattheures"

Records the cache key of the take that is currently in the section, into
content/narration-locks.json. From then on, every generation reuses that exact
audio for that paragraph — even if the spoken text changes because a rule was
added, a local fix applied, or the typography pass ran.

Why this exists
---------------
The engine is not consistent: the same words read twice give different results,
so a paragraph that is RIGHT is a result, not a reproducible state. Without a
lock, any change to the substitution table turns an approved paragraph into a
cache miss and replaces a good reading with a fresh roll of the dice — which is
how a fix to one paragraph came to cost re-listening to a whole section.

Locking makes approval permanent. Use --unlock to release one.
"""

from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import re
import sys
from pathlib import Path

spec = importlib.util.spec_from_file_location("fish_tts", Path(__file__).parent / "fish_tts.py")
tts = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tts)

LOCKS = Path("content") / "narration-locks.json"


def _keys_for_section(args, lang, names, voices, section_id):
    """Every block of one section, with the cache key it currently resolves to."""
    base = Path("tts-text") / args.piece
    manifest = json.loads((base / "manifest.json").read_text(encoding="utf-8"))
    fixes = tts.load_local_fixes(args.piece)
    for section in manifest["sections"]:
        if section["id"] != section_id:
            continue
        raw = (base / section["text"]).read_text(encoding="utf-8").strip()
        pieces = []
        for block in re.split(r"(\n\s*\n)", raw):
            if not block.strip():
                pieces.append(block)
                continue
            prepped = tts.prepare_spoken_text(block, lang, verbose=False, voices=set(names))
            prepped, _ = tts.apply_local_fixes(prepped, fixes)
            pieces.append(prepped)
        blocks = [b.strip() for b in re.split(r"\n\s*\n", "".join(pieces)) if b.strip()]
        sectioned = any(b.startswith(tts.HEADING_PREFIX) for b in blocks)
        unit = -1
        for b in blocks:
            head = b.startswith(tts.HEADING_PREFIX)
            title = b.startswith(tts.SECTION_PREFIX) and not head
            # The alternation marker starts a new unit, exactly as in the
            # generator — without this the voices are assigned wrongly and half
            # the marked blocks look changed when nothing has changed.
            alt = b.startswith(tts.ALT_PREFIX)
            if not title and (head or alt or not sectioned or unit < 0):
                unit += 1
            vid = voices[0] if title else voices[unit % len(voices)]
            marker = tts.SECTION_PREFIX if title else tts.HEADING_PREFIX
            spoken = b[len(marker):].strip() if (head or title) else b
            # Strip the alternation marker exactly as the generator does, or the
            # key is wrong and every marked block looks changed.
            if spoken.startswith(tts.ALT_PREFIX):
                spoken = spoken[len(tts.ALT_PREFIX):].strip()
            override = tts.VOICE_HEADING.get(names[unit % len(names)], {})
            term = override.get("terminal", tts.HEADING_TERMINAL.get(lang, ""))
            if (head or title) and term and spoken and spoken[-1] not in ".!?:":
                spoken += term
            temp = (override.get("temperature", tts.TEMPERATURE[lang])
                    if (head or title) else tts.TEMPERATURE[lang])
            speed = round(tts.HEADING_SPEED_FACTOR if (head or title) else 1.0, 3)
            d = hashlib.sha256(spoken.encode("utf-8"))
            d.update(f"|{vid}|{tts.MODEL}|{temp}|{speed}|{tts.MP3_BITRATE}|True".encode("utf-8"))
            yield b, d.hexdigest(), section["id"]


def lock_section(args, lang, names, voices, data, entries) -> int:
    """Lock a whole approved section — every paragraph, in one go."""
    n = 0
    for block, key, sid in _keys_for_section(args, lang, names, voices, args.section):
        if not (tts.CACHE_DIR / key[:2] / f"{key}.mp3").is_file():
            print(f"  skipped (no audio): {' '.join(block.split())[:46]}")
            continue
        where = " ".join(block.lstrip("# ").split())[:60]
        entries[:] = [e for e in entries if e.get("where") != where]
        entries.append({"where": where, "key": key, "section": sid,
                        "voices": "-".join(names)})
        n += 1
    LOCKS.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"  LOCKED {n} paragraph(s) in [{args.section}] — this section is now permanent")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("piece", help="e.g. countries/CAN/fr")
    ap.add_argument("--where", help="opening words of the paragraph")
    ap.add_argument("--section", help="lock EVERY paragraph in this section at once")
    ap.add_argument("--alternate", help='two voices, "a|b"')
    ap.add_argument("--voice", help="single voice name")
    ap.add_argument("--unlock", action="store_true", help="release the lock instead")
    args = ap.parse_args()

    lang = args.piece.rstrip("/").split("/")[-1]
    names = ([n.strip() for n in args.alternate.split("|")] if args.alternate
             else [args.voice])
    if not names or not names[0]:
        print("give --voice or --alternate")
        return 2
    voices = [tts.VOICES[lang][n] for n in names]

    data = {"locked": {}}
    if LOCKS.is_file():
        data = json.loads(LOCKS.read_text(encoding="utf-8"))
    entries = data.setdefault("locked", {}).setdefault(args.piece, [])

    if args.unlock:
        before = len(entries)
        data["locked"][args.piece] = [e for e in entries
                                      if args.where.lower() not in e.get("where", "").lower()]
        LOCKS.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n",
                         encoding="utf-8")
        print(f"  released {before - len(data['locked'][args.piece])} lock(s)")
        return 0

    if args.section and not args.where:
        return lock_section(args, lang, names, voices, data, entries)

    base = Path("tts-text") / args.piece
    manifest = json.loads((base / "manifest.json").read_text(encoding="utf-8"))
    fixes = tts.load_local_fixes(args.piece)

    for section in manifest["sections"]:
        raw = (base / section["text"]).read_text(encoding="utf-8").strip()
        pieces = []
        for block in re.split(r"(\n\s*\n)", raw):
            if not block.strip():
                pieces.append(block)
                continue
            prepped = tts.prepare_spoken_text(block, lang, verbose=False, voices=set(names))
            prepped, _ = tts.apply_local_fixes(prepped, fixes)
            pieces.append(prepped)
        text = "".join(pieces)

        blocks = [b.strip() for b in re.split(r"\n\s*\n", text) if b.strip()]
        sectioned = any(b.startswith(tts.HEADING_PREFIX) for b in blocks)
        unit = -1
        for b in blocks:
            head = b.startswith(tts.HEADING_PREFIX)
            title = b.startswith(tts.SECTION_PREFIX) and not head
            # The alternation marker starts a new unit, exactly as in the
            # generator — without this the voices are assigned wrongly and half
            # the marked blocks look changed when nothing has changed.
            alt = b.startswith(tts.ALT_PREFIX)
            if not title and (head or alt or not sectioned or unit < 0):
                unit += 1
            if args.where.lower() not in b.lower():
                continue
            vid = voices[0] if title else voices[unit % len(voices)]
            marker = tts.SECTION_PREFIX if title else tts.HEADING_PREFIX
            spoken = b[len(marker):].strip() if (head or title) else b
            # Strip the alternation marker exactly as the generator does, or the
            # key is wrong and every marked block looks changed.
            if spoken.startswith(tts.ALT_PREFIX):
                spoken = spoken[len(tts.ALT_PREFIX):].strip()
            override = tts.VOICE_HEADING.get(names[unit % len(names)], {})
            term = override.get("terminal", tts.HEADING_TERMINAL.get(lang, ""))
            if (head or title) and term and spoken and spoken[-1] not in ".!?:":
                spoken += term
            temp = (override.get("temperature", tts.TEMPERATURE[lang])
                    if (head or title) else tts.TEMPERATURE[lang])
            speed = round(tts.HEADING_SPEED_FACTOR if (head or title) else 1.0, 3)
            d = hashlib.sha256(spoken.encode("utf-8"))
            d.update(f"|{vid}|{tts.MODEL}|{temp}|{speed}|{tts.MP3_BITRATE}|True".encode("utf-8"))
            key = d.hexdigest()
            if not (tts.CACHE_DIR / key[:2] / f"{key}.mp3").is_file():
                print(f"  no audio for that paragraph yet — generate it first")
                return 1
            entries[:] = [e for e in entries if e.get("where") != args.where]
            entries.append({"where": args.where, "key": key,
                            "section": section["id"], "voices": "-".join(names)})
            LOCKS.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n",
                             encoding="utf-8")
            print(f"  LOCKED [{section['id']}] {' '.join(b.split())[:52]}")
            print(f"    this take is now permanent; regeneration cannot replace it")
            return 0

    print("  no paragraph matched that text")
    return 1


if __name__ == "__main__":
    sys.exit(main())
