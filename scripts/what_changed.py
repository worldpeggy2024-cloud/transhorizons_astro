#!/usr/bin/env python3
"""What will change if I regenerate — and where to listen for it.

    python scripts/what_changed.py countries/CAN/fr --alternate "reflechie|flork"
    python scripts/what_changed.py articles/travel-observation/fr --voice peggy

Prints, per section, only the paragraphs whose SPOKEN text differs from what is
already recorded, with the timestamp each one currently sits at in the existing
MP3. Sends nothing to the API and writes nothing.

Why this exists
---------------
Every rule added to the substitution table changes some paragraphs and leaves
others untouched, and the difference is invisible from the outside — so a fix to
three paragraphs turned into re-listening to a whole section, repeatedly. This
turns "regenerate and hope" into a listening list: these five paragraphs, at
these times. Everything else is byte-identical to what was already approved.

It is deliberately read-only. Run it BEFORE regenerating to see the scope, and
again AFTER to get the timestamps in the new file.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import importlib.util

spec = importlib.util.spec_from_file_location("fish_tts", Path(__file__).parent / "fish_tts.py")
tts = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tts)


def duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(path)],
        capture_output=True, text=True).stdout.strip()
    try:
        return float(out)
    except ValueError:
        return 0.0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("piece", help="e.g. countries/CAN/fr or articles/travel-observation/en")
    ap.add_argument("--alternate", help='two voices, "a|b"')
    ap.add_argument("--voice", help="single voice name")
    args = ap.parse_args()

    lang = args.piece.rstrip("/").split("/")[-1]
    base = Path("tts-text") / args.piece
    manifest = json.loads((base / "manifest.json").read_text(encoding="utf-8"))

    if args.alternate:
        names = [n.strip() for n in args.alternate.split("|")]
    elif args.voice:
        names = [args.voice]
    else:
        return print("give --voice or --alternate") or 2
    voices = [tts.VOICES[lang][n] for n in names]
    folder = "-".join(names)
    out_dir = Path("tts-out") / args.piece.replace(f"/{lang}", f"/{lang}/{folder}")

    grand = 0
    for section in manifest["sections"]:
        fixes = tts.load_local_fixes(args.piece)
        raw = (base / section["text"]).read_text(encoding="utf-8").strip()
        # Local fixes must be applied here too, or this tool under-reports: a
        # paragraph changed only by a local fix would look unchanged.
        parts = []
        for chunk in re.split(r"(\n\s*\n)", raw):
            if not chunk.strip():
                parts.append(chunk)
                continue
            prepped = tts.prepare_spoken_text(chunk, lang, verbose=False,
                                              voices=set(names))
            prepped, _ = tts.apply_local_fixes(prepped, fixes)
            parts.append(prepped)
        text = "".join(parts)
        blocks = [b.strip() for b in re.split(r"\n\s*\n", text) if b.strip()]
        sectioned = any(b.startswith(tts.HEADING_PREFIX) for b in blocks)
        mp3 = out_dir / section["mp3"]
        unit, at, rows = -1, 0.0, []
        for b in blocks:
            head = b.startswith(tts.HEADING_PREFIX)
            title = b.startswith(tts.SECTION_PREFIX) and not head
            # The alternation marker starts a new unit, exactly as in the
            # generator — without this the voices are assigned wrongly and half
            # the marked blocks look changed when nothing has changed.
            alt = b.startswith(tts.ALT_PREFIX)
            if not title and (head or alt or not sectioned or unit < 0):
                unit += 1
            if head:
                at += tts.HEADING_PAUSE_BEFORE_MS / 1000
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
            cached = tts.CACHE_DIR / key[:2] / f"{key}.mp3"
            if not cached.is_file():
                rows.append((at, "TITLE" if (head or title) else "     ",
                             " ".join(b.lstrip("# ").split())[:58]))
                at += 0            # unknown length: it does not exist yet
            else:
                at += duration(cached)
            at += (tts.HEADING_PAUSE_AFTER_MS if head else tts.PARAGRAPH_PAUSE_MS) / 1000
        if rows:
            grand += len(rows)
            here = f"  {section['id']}" + ("" if mp3.exists() else "   (no recording yet)")
            print(here)
            for t, kind, txt in rows:
                print(f"     {int(t)//60}:{int(t)%60:02d}  {kind} {txt}")
    print(f"\n  {grand} paragraph(s) would change. Everything else is unchanged —"
          f" no need to listen again.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
