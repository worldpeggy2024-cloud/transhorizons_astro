#!/usr/bin/env python3
"""
flatline_audit.py - Repetition, structure & consistency report for a FOLDER
of Markdown files (the split Flatline Construct).

Does NOT rewrite anything. Reads every .md in a folder and prints a report:
  1. Per-file heading outline + line count
  2. Within-file near-duplicate paragraphs
  3. CROSS-file near-duplicate paragraphs (same passage living in two files)
  4. CORE-block drift check (compares the CORE block across files, since you
     deliberately replicate it - flags any that differ)
  5. Canon-term consistency (every mention of configured terms, gathered
     across all files, so contradictions become visible to you)

Read-only by design: a script that "fixes" canon can silently corrupt the
thing you rely on. You make every edit decision.

USAGE:
    python3 flatline_audit.py path/to/folder
    python3 flatline_audit.py .          (the folder you are standing in)

Given a single .md file instead of a folder, it audits just that file
(cross-file checks skipped).
"""

import sys
import os
import re
from difflib import SequenceMatcher

# ---- knobs you can tune -------------------------------------------------
SIMILARITY_THRESHOLD = 0.75   # within-file paragraph duplicate sensitivity (0-1)
CROSS_FILE_THRESHOLD = 0.70   # cross-file is looser (wording drifts across files)
MIN_PARA_WORDS = 12           # ignore short paragraphs (headers, one-liners)
CORE_HEADING_HINT = "CORE"    # how the replicated block is labelled

# Terms whose every mention you want gathered so contradictions show.
# Case-insensitive substring match. Add anything a brainstorm might contradict.
CANON_TERMS = [
    "2050s", "2060s", "2080", "2095", "2100", "2105",
    "grey eyes", "green eyes", "blue eye", "red hair",
    "sea-level", "drowned", "ice-jam", "flood",
    "haiti", "congo-kinshasa", "congo-brazzaville", "drc",
    "vegapunk", "refusal, not removal",
    "arte",
]
# -------------------------------------------------------------------------


def normalize(text):
    text = text.lower()
    text = re.sub(r"[*_`#>]", "", text)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^\w\s]", "", text)
    return text.strip()


def headings(raw):
    out = []
    for i, line in enumerate(raw.splitlines(), 1):
        m = re.match(r"^(#{1,6})\s+(.*)", line)
        if m:
            out.append((i, len(m.group(1)), m.group(2).strip()))
    return out


def paragraphs(raw):
    paras, buf, start = [], [], None
    for i, line in enumerate(raw.splitlines(), 1):
        if line.strip() == "":
            if buf:
                paras.append((start, " ".join(buf)))
                buf, start = [], None
        else:
            if start is None:
                start = i
            buf.append(line.strip())
    if buf:
        paras.append((start, " ".join(buf)))
    result = []
    for start, text in paras:
        if re.match(r"^#{1,6}\s", text):
            continue
        if len(normalize(text).split()) >= MIN_PARA_WORDS:
            result.append((start, text))
    return result


def near_dupes(paras, threshold):
    hits = []
    norm = [(ln, normalize(t)) for ln, t in paras]
    for a in range(len(norm)):
        for b in range(a + 1, len(norm)):
            r = SequenceMatcher(None, norm[a][1], norm[b][1]).ratio()
            if r >= threshold:
                hits.append((r, norm[a][0], norm[b][0], paras[a][1], paras[b][1]))
    hits.sort(reverse=True)
    return hits


def cross_dupes(files_paras, threshold):
    hits = []
    names = list(files_paras.keys())
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            fa, fb = names[i], names[j]
            pa = [(ln, normalize(t), t) for ln, t in files_paras[fa]]
            pb = [(ln, normalize(t), t) for ln, t in files_paras[fb]]
            for lna, na, ta in pa:
                for lnb, nb, tb in pb:
                    r = SequenceMatcher(None, na, nb).ratio()
                    if r >= threshold:
                        hits.append((r, fa, lna, fb, lnb, ta, tb))
    hits.sort(reverse=True)
    return hits


def extract_core(raw):
    lines = raw.splitlines()
    start = None
    for i, line in enumerate(lines):
        if CORE_HEADING_HINT in line and ("READ FIRST" in line.upper()
                                          or line.strip().startswith("CORE")):
            start = i
            break
    if start is None:
        return None
    block = []
    for line in lines[start + 1:]:
        if line.strip().startswith("---") or re.match(r"^#{1,2}\s", line):
            break
        block.append(line)
    return normalize("\n".join(block))


def snippet(text, n=85):
    return (text[:n] + "...") if len(text) > n else text


def canon(files_raw, terms):
    results = {}
    for term in terms:
        hits = []
        for fname, raw in files_raw.items():
            for i, line in enumerate(raw.splitlines(), 1):
                if term.lower() in line.lower():
                    hits.append((fname, i, line.strip()))
        if hits:
            results[term] = hits
    return results


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 flatline_audit.py <folder-or-file>")
        sys.exit(1)

    target = sys.argv[1]
    if os.path.isdir(target):
        md_files = sorted(f for f in os.listdir(target) if f.endswith(".md"))
        paths = {f: os.path.join(target, f) for f in md_files}
    else:
        paths = {os.path.basename(target): target}

    files_raw = {}
    for name, path in paths.items():
        with open(path, encoding="utf-8") as fh:
            files_raw[name] = fh.read()

    files_paras = {name: paragraphs(raw) for name, raw in files_raw.items()}

    print("=" * 72)
    print("1. FILES & HEADING OUTLINE")
    print("=" * 72)
    for name, raw in files_raw.items():
        print("\n  %s  (%d lines)" % (name, len(raw.splitlines())))
        for ln, level, title in headings(raw):
            print("    L%-5d%s%s %s" % (ln, "  " * (level - 1), "#" * level, title))

    print("\n" + "=" * 72)
    print("2. WITHIN-FILE NEAR-DUPLICATES  (threshold %s)" % SIMILARITY_THRESHOLD)
    print("=" * 72)
    any_hit = False
    for name, paras in files_paras.items():
        dups = near_dupes(paras, SIMILARITY_THRESHOLD)
        if dups:
            any_hit = True
            print("\n  --- %s ---" % name)
            for r, la, lb, ta, tb in dups:
                print("  [%.0f%%] L%d <-> L%d" % (r * 100, la, lb))
                print("    A: %s" % snippet(ta))
                print("    B: %s" % snippet(tb))
    if not any_hit:
        print("  None.")

    print("\n" + "=" * 72)
    print("3. CROSS-FILE NEAR-DUPLICATES  (threshold %s)" % CROSS_FILE_THRESHOLD)
    print("  (deliberate shared canon like Art/CORE is expected - you judge)")
    print("=" * 72)
    xd = cross_dupes(files_paras, CROSS_FILE_THRESHOLD)
    if not xd:
        print("  None.")
    for r, fa, la, fb, lb, ta, tb in xd[:40]:
        print("\n  [%.0f%%] %s L%d  <->  %s L%d" % (r * 100, fa, la, fb, lb))
        print("    A: %s" % snippet(ta))
        print("    B: %s" % snippet(tb))

    print("\n" + "=" * 72)
    print("4. CORE-BLOCK DRIFT  (replicated CORE should be identical)")
    print("=" * 72)
    cores = {n: extract_core(r) for n, r in files_raw.items()}
    cores = {n: c for n, c in cores.items() if c}
    if len(cores) < 2:
        print("  CORE block found in %d file(s) - nothing to compare." % len(cores))
    else:
        names = list(cores.keys())
        reference = names[0]
        print("  Comparing all against: %s" % reference)
        all_match = True
        for other in names[1:]:
            r = SequenceMatcher(None, cores[reference], cores[other]).ratio()
            if r > 0.97:
                flag = "OK"
            else:
                flag = ">>> DIFFERS <<<"
                all_match = False
            print("    %s: %.0f%% match  %s" % (other, r * 100, flag))
        if all_match:
            print("  All CORE blocks match the reference.")
        else:
            print("  Investigate the DIFFERS files - CORE has drifted between copies.")

    print("\n" + "=" * 72)
    print("5. CANON-TERM CONSISTENCY  (every mention gathered - you judge)")
    print("=" * 72)
    mentions = canon(files_raw, CANON_TERMS)
    if not mentions:
        print("  No configured canon terms found.")
    for term, hits in mentions.items():
        print("\n  TERM: \"%s\"  (%d mention(s))" % (term, len(hits)))
        for fname, ln, text in hits:
            print("    %s L%d: %s" % (fname, ln, snippet(text)))

    print("\n" + "=" * 72)
    print("Report complete. Nothing was changed. All edit decisions are yours.")
    print("=" * 72)


if __name__ == "__main__":
    main()
