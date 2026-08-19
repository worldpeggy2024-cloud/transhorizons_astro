import glob
import io
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

# Numbers ending in 1 but not 11 (onze needs no agreement), followed by a word.
pat = re.compile(r"\b(\d{1,3}(?:[  ]\d{3})*|\d+)\s+([a-zà-ÿ][\wà-ÿ'-]+)", re.IGNORECASE)

hits = {}
for path in sorted(glob.glob("tts-text/countries/CAN/fr/*.txt")):
    sec = os.path.basename(path)
    text = io.open(path, encoding="utf-8").read().replace("\n", " ")
    for m in pat.finditer(text):
        num, word = m.group(1), m.group(2)
        digits = re.sub(r"\D", "", num)
        if not digits.endswith("1") or digits.endswith("11"):
            continue
        key = f"{num} {word}"
        hits.setdefault(key, []).append(sec)

print(f"numbers ending in 'un' followed by a noun: {len(hits)} distinct\n")
for key, secs in sorted(hits.items()):
    where = ", ".join(sorted(set(s.replace(".txt", "") for s in secs)))
    print(f"  {key:38}  {where}")
