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
    # ENGLISH — grouped by ACCENT, because the accent should suit the country.
    # A United States report read in British English, or a United Kingdom report
    # in American, undercuts the piece before a word of analysis lands.
    #   GBR -> British      USA -> United States    AUS -> Australia
    #   CAN -> either; in practice the British voices have read it well.
    # Everywhere else, English is the reporting language rather than the local
    # one, so no accent is "right" — pick for readability, not for geography.
    # IND is deliberately NOT an exception, though Indian English is a local
    # variety with its own standard and would otherwise qualify. Peggy's call
    # (2026-08-18): the audience is international and largely non-native, and
    # comprehension across that audience outranks accent-matching. A decision
    # about listeners, not about the accent.
    # The clones are NOT one of these choices: see their group below.
    "en": {
        # ── British ──────────────────────────────────────────────────────────
        # https://fish.audio/app/m/b82d76382a3f40139e76ffbd095da13d/
        # NB: the library holds many voices titled "adam stone" — this URL is
        # the only reliable way back to the right one. Searching the name is not.
        "adam-stone":  "b82d76382a3f40139e76ffbd095da13d",  # male, expressive — APPROVED
                                                            # for resource-civilization EN and the
                                                            # CAN report duet (2026-08-16/17)
        # https://fish.audio/app/m/e422370a73e4439b8ccc10d58b78819b/
        "deep-voice":  "e422370a73e4439b8ccc10d58b78819b",  # male, deeper. Untried on a full piece.
        # https://fish.audio/app/m/64028e2c8f8640e6bebf4826b7dc1ebc/
        "ogechi":      "64028e2c8f8640e6bebf4826b7dc1ebc",  # female — CAN report duet partner
        # https://fish.audio/app/m/b7204d4e40ef4a548c7c8547b7f73492/
        "alok":        "b7204d4e40ef4a548c7c8547b7f73492",  # male. Untried on a full piece.
        # https://fish.audio/app/m/b99f2c4a0012471cb32ab61152e7e48d/
        "black-struggles": "b99f2c4a0012471cb32ab61152e7e48d",  # male. Untried on a full piece.

        # ── United States ────────────────────────────────────────────────────
        # THE USA REPORT DUET (chosen 2026-08-18): laura + war-arsenal.
        # https://fish.audio/app/m/e3cd384158934cc9a01029cd7d278634/
        "laura":       "e3cd384158934cc9a01029cd7d278634",  # female, deep — US duet partner
        # https://fish.audio/app/m/9184d174052b422d9fe2514ec0d4d095/
        "war-arsenal": "9184d174052b422d9fe2514ec0d4d095",  # male, clear — US duet partner.
                                                            # Replaced "adrian", dropped 2026-08-17
                                                            # as too monotone.
        # https://fish.audio/app/m/fd176117735446968cca7911ee4da42b/
        "deep-story":  "fd176117735446968cca7911ee4da42b",  # male. Untried on a full piece.
        # https://fish.audio/app/m/7cefff1c89464d7dbc412482f909ec2d/
        "florence":    "7cefff1c89464d7dbc412482f909ec2d",  # Florence Scovel Shinn, lighter
        # https://fish.audio/app/m/7e4baf13677e4b95b5e25a60b9a717b4/
        "old-woman":   "7e4baf13677e4b95b5e25a60b9a717b4",  # softer — FAVOURITE
        # REJECTED 2026-08-12 — monotone, "really not pleasant to listen to".
        # Kept only so the already-generated tts-out/**/sarah/ files stay addressable.
        "sarah":       "933563129e564b19a115bedd57b7406a",
        #
        # BALANCE, not preference: the British voices have been the better
        # readers so far, but reading everything in marked British English would
        # be wrong for a site covering many countries — and plainly wrong for the
        # USA. Accent follows the subject.

        # ── Ireland ──────────────────────────────────────────────────────────
        # No Irish report exists yet — banked so the accent is not the thing
        # that delays one.
        # https://fish.audio/app/m/5309a299f3ea4c538f39c31a407bcfe8/
        "shelb":          "5309a299f3ea4c538f39c31a407bcfe8",  # male ("Test shelb")
        # https://fish.audio/app/m/a2ed529cad824e76b0bfe5edda31bd93/
        "irish-narrator": "a2ed529cad824e76b0bfe5edda31bd93",  # female (Irish Cultural Narrator)

        # ── Australia ────────────────────────────────────────────────────────
        # Directly usable: AUS is one of the thirteen country files.
        # https://fish.audio/app/m/6e2352b1dafe423889af34b5d8093ae1/
        "younger":        "6e2352b1dafe423889af34b5d8093ae1",  # male ("Younger")
        # https://fish.audio/app/m/46e236a33f0e49ec977b6d5f3c639a41/
        "friendly-aus":   "46e236a33f0e49ec977b6d5f3c639a41",  # female (Friendly Australian)

        # ── French-accented English (Peggy's own voice) ──────────────────────
        # Not a third national accent to pick from: this is how Peggy actually
        # speaks English, after 28 years outside France. Reserve these for the
        # NOTES — first-person pieces where the voice IS hers and the accent is
        # the point. Country reports keep a neutral narrator whose accent suits
        # the country, so a clone never narrates one.
        # Recorded 2026-08-15 in one sitting from ENGLISH source audio, so these
        # carry her real accent. The FRENCH clone below is a different matter:
        # trained only on French, it applies French phonology to English and
        # comes out far heavier than she is ("really too much"). One clone per
        # language, never one clone for both.
        # Three reads rather than three voices — which suits which piece is
        # Peggy's call, not something to infer from the titles.
        "peggy":            "5ef647b1e30a4165a135076f258b7f04",  # Friendly Storyteller
        "peggy-warm":       "8bd5735eec2f4a99b8f118ac35943239",  # Warm Conversational Voice
        "peggy-analytical": "73e52cf94f334f50bc30965b9adb72b2",  # Analytical Narrator
    },
    "fr": {
        # male
        # https://fish.audio/app/m/c51f4c0e9e414d9eaf7c71effd5b92d2/
        "angelokyly":    "c51f4c0e9e414d9eaf7c71effd5b92d2",  # very deep 
        # https://fish.audio/app/m/4f2a0684dd0247dda68f339738c780e6/
        "le-narrateur":  "4f2a0684dd0247dda68f339738c780e6",  # slightly dramatic
         # https://fish.audio/app/m/6e10fb8946b34ba6bec447789ccdc3de/
        "stoic-2":       "6e10fb8946b34ba6bec447789ccdc3de",  # Voix stoïc 2 — FAVOURITE
        # female
        # https://fish.audio/app/m/651751df29b140ab9c791aef35dc8fc2/
        "ora":           "651751df29b140ab9c791aef35dc8fc2",  # articulate, but monotone by nature
        # https://fish.audio/app/m/b5061779983d410dab91f4d070ca5586/
        "reflechie":     "b5061779983d410dab91f4d070ca5586",  # Voix Française Réfléchie — FAVOURITE
                                                              # APPROVED for resource-civilization FR (2026-08-16).
                                                              # Also the only voice (with le-narrateur) that reads a
                                                              # parenthetical aside with the right drop — parentheses
                                                              # turned out to be model-linked, not fixable in text.
        # ── to try — unheard, so unranked ────────────────────────────────────
        # French has a thinner bench than English, so these get worked through
        # one at a time rather than banked as a finished set. The test that
        # matters is the PARENTHETICAL ASIDE: only reflechie and le-narrateur
        # drop the pitch correctly on one, and that turned out to be a property
        # of the model, not something fixable in the text. Try a new French
        # voice on a parenthesis paragraph before trusting it with a section.
        # https://fish.audio/app/m/276b6ef7fd9f4fb0aef6885fcf3ebfe0/
        "documentaire":  "276b6ef7fd9f4fb0aef6885fcf3ebfe0",  # "Documentaire vlog"
        # https://fish.audio/app/m/276bd156a53f4a0199fff081bf083fc8/
        "bon-a-savoir":  "276bd156a53f4a0199fff081bf083fc8",  # "Bon à savoir"
        # https://fish.audio/app/m/76d65c1e73774db69683a553b30b414f/
        # NB: unrelated to the US "adrian" dropped 2026-08-17 — different voice,
        # different language, near-identical name.
        "adrien":        "76d65c1e73774db69683a553b30b414f",  # male ("Adrien french")

        # Peggy's own cloned voice, FRENCH model ("Voix Féminine Chaleureuse").
        # Both clones are PRIVATE and reachable only with this account's key —
        # keep them private. Intended for the NOTES only: first-person pieces in
        # her own voice, while the reports keep a neutral narrator.
        "peggy":         "b31cd0e36a6d4e72864c4994cd1ec66e",
    },
}
# "adrian" (US) was removed from the registry, so the English default moved to
# adam-stone — the only English voice approved on a full piece.
DEFAULT_VOICE = {"en": "adam-stone", "fr": "reflechie"}


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
        # "Saskatchewane" still came out as "Saskatch-chewan" inside a long
        # paragraph, and it dragged the following "Labrador" down with it.
        # "Sasskatchouane" reads cleanly and leaves its neighbours alone
        # (chosen by ear 2026-08-16 from six variants in the real sentence).
        (r'\bSaskatchewan\b', 'Sasskatchouane', 'place name'),
        # WHY FRENCH HAS THIS ENTRY AND ENGLISH DOES NOT (Peggy, 2026-09-03):
        # in French, "Saskatchewan" is a borrowed name — the province speaks
        # English — so a French voice missing it is an expected foreign-word
        # failure, and respelling it is a fair accommodation. In English it is a
        # native place name: a mispronunciation there is a defect, not an
        # accent, and the honest fix is to make the engine say the real word.
        # Tested in Adam Stone in the real sentence (2026-09-03): the plain
        # spelling read correctly, so the earlier failure was STOCHASTIC, not a
        # property of the word. Use --reroll, never an English respelling.
        # English term of art quoted inside French prose ("la théorie des
        # principales ressources (staples thesis; Innis, 1930)"). The French
        # voice reads it as French and it becomes unrecognisable; this respells
        # the English pronunciation in French orthography.
        (r'(?i)\bstaples[- ]thesis\b', 'stéïpeulz sessiss', 'English term in French'),
        # "émergent" is a homograph: the ADJECTIVE ends /ɑ̃/ ("l'ordre mondial
        # émergent"), the VERB does not ("les civilisations émergent d'une
        # interaction"). The engine read the adjective as the verb. Respelling
        # to "émergeant" forces the adjectival reading.
        #
        # The plural -s decides it. "émergents" is only ever the adjective, so
        # it is always safe. Bare "émergent" is only substituted when the word
        # BEFORE it does not end in s/x — a French plural subject does, so the
        # verb is left untouched.
        # FEMININE NUMBER AGREEMENT. The normaliser expands a number ending in 1
        # as "un" regardless of the noun that follows, so "31 installations"
        # comes out "trente et un installations". Spelling the number out in
        # full sidesteps the normaliser for exactly these phrases; the digits
        # stay in the YAML and on the page. Confirmed by Peggy 2026-08-17.
        # Only the noun's gender decides this, so each entry is deliberate
        # rather than a general rule — a wrong guess would speak bad French.
        (r'\b31 installations\b', 'trente et une installations', 'feminine number'),
        (r'\b381 mégatonnes\b', 'trois cent quatre-vingt-une mégatonnes', 'feminine number'),
        (r'\b41 régions\b', 'quarante et une régions', 'feminine number'),
        # "relevant" (participle of relever) comes out as "relavant". A plain
        # mispronunciation, not an English reading — the vowel in the unstressed
        # first syllable is what goes wrong, and spelling it "eu" fixes it.
        # Provisional: Peggy is testing alternatives directly in Fish.
        (r'\brelevant\b', 'releuvant', 'mispronounced participle'),
        (r'\bémergents\b', 'émergeants', 'adjective, plural'),
        (r'(?<=[^sxSX\W]\s)émergent\b', 'émergeant', 'adjective, singular'),
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

        # ── CAN report, English pass 2026-08-18 ──────────────────────────────
        # Currency symbols. The engine reads "US$115" as "you-ess-dollar-115"
        # or drops the unit entirely; spelling the unit AFTER the number puts it
        # where an English speaker expects it. The scale word has to be carried
        # across, and it may be bound to the number by a no-break space from the
        # number-binding pass, hence the explicit    class.
        (r'US\$([\d.,]+)([\s  ]+(?:billion|million|trillion))?',
         r'\1\2 US dollars', 'US currency'),
        (r'C\$([\d.,]+)([\s  ]+(?:billion|million|trillion))?',
         r'\1\2 Canadian dollars', 'Canadian currency'),

        # Minus sign before a figure — read as a dash, a pause, or nothing at
        # all, which silently inverts the meaning of an emissions or GDP change.
        # Scoped to a sign that OPENS a number (preceded by a space or a paren)
        # so date and page ranges ("2001-2002") are untouched.
        (r'(?<=[\s(])[−–-](?=\d)', 'minus ', 'negative figure'),

        # Comma-grouped thousands: "133,000 employees" came out unscaled. Not
        # applied inside longer groupings (the negative lookahead), where the
        # engine's own normalisation handles it.
        (r'(?<![\d,])(\d{1,3}),000\b(?!,)', r'\1 thousand', 'thousands separator'),

        # CUSMA is spelled out letter by letter. Peggy's reading: "KUZ-ma".
        (r'\bCUSMA\b', 'Kuzma', 'acronym read as a word'),

        # Case citations: "v." is read "vee" or "versus"; in spoken legal
        # English it is "and". A capitalised party is required on the right so
        # ordinary abbreviations are not caught.
        (r'(?<=\w)\s+v\.?\s+(?=[A-Z])', ' and ', 'case citation'),
        # A currency RANGE: the scale word sits at the far end but governs both
        # figures. "$45 to $113 billion" was read "45 dollars to 113 billion
        # dollars", which understates the floor by a factor of a billion.
        (r'\$(\d[\d.,]*) to \$(\d[\d.,]*)([\s\u00a0\u202f]+(?:billion|million|trillion))',
         r'\1\3 to \2\3 dollars', 'currency range'),

        # ── respellings PROPOSED, not yet confirmed by ear ───────────────────
        # Guesses at what the engine will accept. Check them with
        # tts-text/tests/pronunciation-en.txt before committing to a full run.
        (r'\blaicity\b', 'layissity', 'PROPOSED - laicity'),
        (r'\bLaicity\b', 'Layissity', 'PROPOSED - laicity'),
        (r'\blegislature(s?)\b', r'lejislature\1', 'PROPOSED - legislature'),
        (r'\bSecession\b', 'Sesession', 'PROPOSED - secession'),
        #
        # CONSIDERED AND DELIBERATELY NOT ADDED — do not add these later:
        #
        # "salience" — Peggy expected "SAY-lee-uns" and heard something nearer
        #   "SEE-lee-uns". Both are real: the vowel varies by accent, so there is
        #   no single correct form to force. Left alone by her decision
        #   (2026-09-04). Appears twice (society.religion, security.transnational).
        #
        # "constitutionality" — Ogechi drops a syllable ("constitunality") as the
        #   LAST word of a 1,122-character paragraph. Not a mispronunciation: the
        #   engine settles into one contour per request and compresses as it runs
        #   out, the same mechanism behind the rising-intonation paragraphs in the
        #   travel note. "constitutional" (x18) and "constitutionally" (x3) read
        #   fine everywhere, which is what rules out the word itself as the cause.
        #   Fix with --reroll, never a respelling (Peggy, 2026-09-04).

        # Tsilhqot'in — "sill-ko-teen", per the Province of British Columbia's
        # own "Guide to the Pronunciation of Indigenous Communities and
        # Organizations in BC" (Oct 2018), which lists the Tsilhqot'in National
        # Government by name. A published provincial source, not a guess.
        (r"\bTsilhqot['’]in\b", 'Sill-ko-teen', 'Tsilhqot’in, per the BC government guide'),

        # Iqaluit — chosen by ear from three rounds of variants (2026-09-03).
        # Inuktitut "q" is a uvular stop, which English has no letter for;
        # Peggy's ear described it as "a mix of hard h and k in the same
        # letter", and heard the engine's default as "aye-KAL-oo-it" — wrong
        # vowel AND wrong consonant. "eekh-raloo-it" carries an "r" the real
        # word does not have: it is there to bend an English voice toward a
        # sound it cannot otherwise make, the same trick as "killometer".
        # An approximation of a sound English lacks, not a correct pronunciation
        # — and it lives ONLY in the audio. The page, the SEO layer and the
        # French all keep the true spelling.
        (r'\bIqaluit\b', 'eekh-raloo-it', 'Iqaluit, chosen by ear'),
        # Nukkiksautiit deliberately has NO entry: the engine reads it correctly
        # as spelled (checked against a recording, 2026-09-03). It looks like it
        # should be broken; it is not. Do not "fix" it.
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

# Generation temperature, per language.
#
# French was 0.3 from 2026-08-12, chosen when a spelled-out number occasionally
# stumbled. The cost only became audible over a full article: steadier prosody
# is also FLATTER, and French was reported as rhythmically wrong, "really feels
# like AI reading" — while English at 0.7 was called expressive on the same
# engine and the same splicing. Raised to 0.7 on 2026-08-15 to test whether the
# flatness was ever the voices' fault. If a number hesitates again, fix the
# number rather than flattening every sentence to hide it.
TEMPERATURE = {"en": 0.7, "fr": 0.7}

# Silence spliced between paragraphs, in milliseconds. Blank lines alone were
# audible but far too short ("we end up gasping for air"). 0 disables splicing
# and sends the whole section as a single request, as before.
PARAGRAPH_PAUSE_MS = 700

# Fade applied to each spliced segment's edges, in milliseconds. Short enough to
# be inaudible as a fade, long enough to kill the click where a separately
# encoded paragraph meets silence.
FADE_MS = 12

# Per-paragraph audio cache. Each paragraph is already synthesised as its own
# request and spliced; this simply KEEPS the pieces instead of discarding them.
# A one-word pronunciation fix then re-synthesises the paragraph that contains
# it, not the whole 16-minute article — and changes to splicing (pause length,
# fade) cost nothing at all, because they re-glue what is already cached.
#
# The key deliberately covers only what determines the AUDIO OF ONE PARAGRAPH:
# its spoken text and the generation settings. Splice settings are excluded, so
# adjusting them never invalidates a single cached paragraph.
CACHE_DIR = Path("tts-cache")

# Headings. extract-narration.cjs marks them with this prefix; it is stripped
# before anything is spoken and never appears on the page. Read at body speed
# and pace they fell flat and cost intelligibility, so they are slowed slightly
# and framed by a long pause before, short pause after — the audiobook shape.
SECTION_PREFIX = "# "   # a section title: "# Territory"
HEADING_PREFIX = "## "
# 1.0 = no slowdown. Was 0.92, which made headings sound like a DIFFERENT
# NARRATOR (heard 2026-08-15): prosody.speed shifts timbre, and a heading is
# already its own request, so it starts fresh rather than continuing the
# previous prosody. The long pause before, short pause after, and the appended
# full stop mark it as a heading well enough on their own.
HEADING_SPEED_FACTOR = 1.0
# Punctuation appended to a heading that lacks it, PER LANGUAGE.
# "." forces the pitch to fall; "" leaves the heading alone.
#
# English keeps the full stop: Adam Stone's headings were approved as they are,
# and nothing has been reported wrong with them. French drops it, because the
# forced fall made the voice drop at the end of every title, which reads as
# closing the title off rather than introducing what follows (2026-08-16).
# Scoped per language on purpose — the evidence is French-only.
HEADING_TERMINAL = {"en": ".", "fr": ""}
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

        def probe_seconds(path: Path) -> float:
            probe = Path(ffmpeg).with_name("ffprobe" + Path(ffmpeg).suffix)
            if not probe.exists():
                return 0.0
            try:
                out = subprocess.run(
                    [str(probe), "-v", "error", "-show_entries", "format=duration",
                     "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
                    check=True, capture_output=True, text=True).stdout.strip()
                return float(out)
            except (subprocess.CalledProcessError, ValueError):
                return 0.0

        listing = []
        for index, part in enumerate(parts):
            piece = work / f"part{index:03d}.mp3"
            piece.write_bytes(part)
            # Each paragraph is separately encoded, so its edges can sit at a
            # non-zero amplitude; butted against silence that is an audible
            # click at every paragraph change. A ~12ms fade at both ends removes
            # it. Breathier voices click more, which is why the artifact was
            # obvious on one voice and inaudible on another.
            duration = probe_seconds(piece)
            if duration > 2 * FADE_MS / 1000:
                faded = work / f"fade{index:03d}.mp3"
                fade = (f"afade=t=in:st=0:d={FADE_MS / 1000:.3f},"
                        f"afade=t=out:st={duration - FADE_MS / 1000:.3f}:d={FADE_MS / 1000:.3f}")
                try:
                    subprocess.run(
                        [ffmpeg, "-y", "-i", str(piece), "-af", fade,
                         "-c:a", "libmp3lame", "-b:a", f"{bitrate}k", str(faded)],
                        check=True, capture_output=True)
                    piece = faded
                except subprocess.CalledProcessError:
                    pass          # keep the unfaded part rather than losing it
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
           temperature: float, pause_ms: int, lang: str = 'en',
           alternates: list[tuple[str, str]] | None = None,
           voice_name: str = '') -> bytes:
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

    # ALTERNATING VOICES (--alternate a|b).
    #
    # The unit of alternation is a UNIT, not a block: a heading and everything
    # under it stay in one voice, so a subsection is never split mid-thought.
    # A block with no heading before it - a baseline paragraph, a situation
    # event - is its own unit. That reproduces the natural item of each section
    # without needing a different rule per section.
    voices: list[tuple[str, str]] = alternates or [(voice_name, voice_id)]
    # Sections that use headings alternate PER HEADING, so a subsection keeps
    # one voice however many paragraphs it runs to. Sections without headings
    # (baseline, situation) alternate per block, which is their natural item.
    sectioned = any(b.startswith(HEADING_PREFIX) for b in blocks)
    unit = -1
    # 0 until --flip-from matches a heading, 1 afterwards: see the loop below.
    flip = 0
    flip_needle = (args.flip_from or '').strip().lower()
    parts: list[bytes] = []
    is_heading: list[bool] = []
    hits = misses = 0

    for block in blocks:
        heading = block.startswith(HEADING_PREFIX)
        # A SECTION title ("# Territory") announces the largest division. It is
        # read by the first voice in every section and does NOT advance the
        # alternation, so section openings sound alike and adding a title does
        # not shift which voice reads which subsection.
        section_title = block.startswith(SECTION_PREFIX) and not heading
        if not section_title and (heading or not sectioned or unit < 0):
            unit += 1
        # --flip-from swaps which voice takes which subsection, from the named
        # heading to the end of the section. Needed because the alternation is
        # positional: when one voice cannot say a word in a particular
        # subsection (Adam Stone and "Saskatchewan", 2026-09-03) the fix is to
        # hand that subsection to the other voice — and every subsection after
        # it then shifts too, or two in a row would share a voice.
        if heading and flip_needle:
            heading_text = block[len(HEADING_PREFIX):].strip().lower()
            if flip_needle in heading_text:
                flip = 1
        this_voice_name, this_voice_id = (
            voices[0] if section_title else voices[(unit + flip) % len(voices)]
        )
        marker = SECTION_PREFIX if section_title else HEADING_PREFIX
        spoken = block[len(marker):].strip() if (heading or section_title) else block
        terminal = HEADING_TERMINAL.get(lang, '')
        if (heading or section_title) and terminal:
            # Kept configurable because the right answer changed. The full stop
            # was added when a heading ran inline into the text that followed
            # and sounded like its first clause. Headings are now their own
            # request, so they end regardless — and the forced fall made the
            # voice drop at the end of every title, which in French reads as odd
            # rather than emphatic (heard 2026-08-16). Empty = leave it alone.
            if spoken and spoken[-1] not in ".!?:":
                spoken += terminal
        speed = round(args.speed * (HEADING_SPEED_FACTOR if (heading or section_title) else 1.0), 3)

        digest = hashlib.sha256(spoken.encode("utf-8"))
        digest.update(f"|{this_voice_id}|{model}|{temperature}|{speed}|{args.bitrate}"
                      f"|{not args.no_normalize}".encode("utf-8"))
        key = digest.hexdigest()
        cached = CACHE_DIR / key[:2] / f"{key}.mp3"

        # --reroll forces a fresh attempt at just the paragraphs that match.
        #
        # Separated by "|", NOT by commas: prose is full of commas, so a needle
        # like "Across decades, movement" silently split into two and matched
        # paragraphs nobody asked for. With no "|" the whole argument is one
        # needle, which is the safe reading of a single phrase.
        needles = ([n for n in args.reroll.split("|")] if args.reroll and "|" in args.reroll
                   else ([args.reroll] if args.reroll else []))
        reroll = any(n.strip() and n.strip().lower() in spoken.lower() for n in needles)
        if not args.no_cache and not reroll and cached.is_file():
            parts.append(cached.read_bytes())
            hits += 1
        else:
            audio = synthesize(spoken, this_voice_id, model, api_key,
                               normalize=not args.no_normalize, bitrate=args.bitrate,
                               speed=speed, temperature=temperature)
            cached.parent.mkdir(parents=True, exist_ok=True)
            cached.write_bytes(audio)
            parts.append(audio)
            misses += 1
        is_heading.append(heading or section_title)

    if hits:
        print(f"      cache: {hits} paragraph(s) reused, {misses} synthesised", flush=True)

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



def resolve_alternates(spec: str | None, lang: str):
    """--alternate "a|b" -> [(name, id), ...]; None when not alternating."""
    if not spec:
        return None
    pairs = [resolve_voice(lang, n.strip()) for n in spec.split("|") if n.strip()]
    if len(pairs) < 2:
        raise FishError('--alternate needs at least two voices, e.g. "adam-stone|ogechi"')
    return pairs


def refresh_from_source(manifest_path: Path, manifest: dict) -> dict:
    """
    Re-extract the narration text from the source YAML before generating.

    Without this, generating uses whatever was extracted last — so an edit to
    the article or report is silently ignored and the recording renders the
    previous wording. That happened, and the fix should not depend on anyone
    remembering to run the extractor first: it is fast, idempotent, and the
    paragraph cache means unchanged text costs nothing to re-extract.
    """
    import json, subprocess

    script = Path(__file__).with_name("extract-narration.cjs")
    if not script.is_file():
        return manifest

    lang = manifest.get("lang", "en")
    if manifest.get("country"):
        target = ["--country", manifest["country"]]
    elif manifest.get("article"):
        target = ["--article", manifest["article"]]
    else:
        return manifest

    before = manifest["sections"][0].get("sha256") if manifest.get("sections") else None
    try:
        subprocess.run(["node", str(script), *target, "--lang", lang],
                       check=True, capture_output=True, text=True)
    except FileNotFoundError:
        print("  ! node not found — generating against the previously extracted text")
        return manifest
    except subprocess.CalledProcessError as exc:
        raise FishError(
            "Re-extracting from the source YAML failed, so the text may be stale.\n"
            f"{(exc.stderr or exc.stdout or '').strip()[:400]}\n"
            "Fix the source, or pass --no-extract to generate from the existing text."
        )

    refreshed = json.loads(manifest_path.read_text(encoding="utf-8"))
    after = refreshed["sections"][0].get("sha256") if refreshed.get("sections") else None
    if before and after and before != after:
        print("  source     : re-extracted — the text has changed since the last run")
    return refreshed


def run_manifest(manifest_path: Path, args, api_key: str) -> int:
    """
    Generate every section listed in a manifest.json from extract-narration.cjs.

    Skips a section whose MP3 already exists and whose recorded sha256 still
    matches the manifest — so a re-run after editing one section regenerates
    that section only, and costs cents rather than dollars.
    """
    import json

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if not args.no_extract:
        manifest = refresh_from_source(manifest_path, manifest)
    base = manifest_path.parent
    lang = manifest.get("lang", args.lang)
    voice_name, default_id = resolve_voice(lang, args.voice_name)
    alternates = resolve_alternates(args.alternate, lang)
    voice_id = args.voice or default_id
    temperature = (args.temperature if args.temperature is not None
                   else TEMPERATURE.get(lang, 0.7))

    # Each voice gets its own directory, so the sets coexist and each keeps its
    # own generated.json — switching voice never invalidates the other set.
    # An alternating run is its own edition, named after the pair.
    folder = "-".join(n for n, _ in alternates) if alternates else voice_name
    if args.out:
        out_dir = args.out
    elif manifest.get("country"):
        out_dir = Path("tts-out") / "countries" / manifest["country"] / lang / folder
    else:
        out_dir = Path("tts-out") / "articles" / manifest.get("article", "") / lang / folder
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
        # Splice settings are included so changing a pause or the fade DOES mark
        # the section stale — which is cheap now: every paragraph comes back
        # from the cache and only the gluing is redone, at no API cost.
        digest.update(f"|{voice_id}|{args.model}|{temperature}|{args.speed}"
                      f"|{args.bitrate}|{not args.no_normalize}"
                      f"|{args.paragraph_pause}|{FADE_MS}"
                      f"|{HEADING_TERMINAL.get(lang, '')}|{HEADING_SPEED_FACTOR}"
                      f"|{HEADING_PAUSE_BEFORE_MS}|{HEADING_PAUSE_AFTER_MS}".encode("utf-8"))
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

    # A reroll bypasses the section-level "already current" check; the paragraph
    # cache still means only the matching paragraphs are actually re-synthesised.
    pending = sections if args.reroll else [
        s for s in sections
        if not (out_dir / s["mp3"]).exists() or state.get(s["id"]) != keys[s["id"]]]
    if args.sections:
        wanted = {w.strip().lower() for w in args.sections.split(",") if w.strip()}
        unknown = wanted - {s["id"].lower() for s in sections}
        if unknown:
            raise FishError(
                f"Unknown section(s): {', '.join(sorted(unknown))}. "
                f"This manifest has: {', '.join(s['id'] for s in sections)}"
            )
        pending = [s for s in pending if s["id"].lower() in wanted]

    total_bytes = sum(s["bytes"] for s in pending)
    cost = total_bytes / 1_000_000 * PRICE_PER_MILLION_BYTES_USD
    print(f"\n{manifest_path}")
    print(f"  model      : {args.model}")
    if alternates:
        print(f"  voices     : {' / '.join(n for n, _ in alternates)}  [{lang}]  (alternating)")
    else:
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
                       temperature, args.paragraph_pause, lang,
                       alternates=alternates, voice_name=voice_name)
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
    parser.add_argument("--voice-name", help="named voice, e.g. adam-stone | laura | "
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
    parser.add_argument("--no-extract", action="store_true",
                        help="do NOT re-extract from the source YAML first; generate "
                             "from the text already in tts-text/ (rarely what you want)")
    parser.add_argument("--sections", metavar="LIST",
                        help="generate only these manifest sections, comma-separated "
                             "(e.g. baseline,scorecard,territory). Everything else is "
                             "left exactly as it is.")
    parser.add_argument("--alternate", metavar="A|B",
                        help="alternate two (or more) registered voices, e.g. "
                             "\"adam-stone|ogechi\". The unit is a SUBSECTION where "
                             "the section has headings, and a paragraph where it does "
                             "not (baseline, situation).")
    parser.add_argument("--flip-from", metavar="HEADING",
                        help="swap the two alternating voices from the subsection "
                             "whose heading contains HEADING to the end of that "
                             "section. For when one voice cannot pronounce a word "
                             "the other can. Only meaningful with --alternate.")
    parser.add_argument("--reroll", metavar="TEXT",
                        help="re-synthesise only paragraphs containing TEXT. Separate "
                             "several targets with | — NOT commas, since prose is full "
                             "of them. For when the text is right but the reading came "
                             "out wrong: this engine is stochastic, so a second attempt "
                             "often differs.")
    parser.add_argument("--no-cache", action="store_true",
                        help="ignore the per-paragraph cache and re-synthesise everything")
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
                       temperature, args.paragraph_pause, args.lang,
                       alternates=resolve_alternates(args.alternate, args.lang),
                       voice_name=voice_name)
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
