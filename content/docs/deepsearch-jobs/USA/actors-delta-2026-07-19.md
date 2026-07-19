# Actors delta — post-topup-3 (USA, 2026-07-19, author-approved)

The actors extraction (actors-extraction-USA-2026-07-19.yaml, kept untouched as the run
record) ran BEFORE the topup-3 rewrites of security.diplomacy and economy.politicalEconomy.
Those rewrites added exactly the named entities whose absence the extraction flagged, so the
installed index was patched closed-book from the new field text — same Layer 1/2 discipline,
EN + FR, anchors to the new registry ids. Applied directly to analysis.yaml.

## Updated (3 — positions superseded by the rewrites)

- **North Atlantic Treaty Organization (NATO)** — was "summit venue only" / report-silent.
  Now: the named 32-member treaty core of the network [nato-member-countries]
  [security.diplomacy]; engagementMode → negotiable / dealable under burden-transfer terms.
  The extraction's humanReview concern (close to filter d) is resolved by the rewrite.
- **Japan** — was "holdings table only, no attributed intention". Now also a named bilateral
  mutual-defence treaty ally and major non-NATO ally [state-collective-defense-arrangements]
  [state-major-non-nato-ally-status]; fieldsCitedIn += security.diplomacy; engagementMode →
  negotiable / dealable.
- **The United Kingdom** — was "holdings table only". Now also a named AUKUS partner
  [crs-aukus-indo-pacific][crs-aukus-pillar2-r47599]; fieldsCitedIn += security.diplomacy;
  engagementMode → negotiable / dealable.

## Added (3)

- **The hyperscalers (Meta, Microsoft, Amazon, Alphabet)** — private-sector aggregate, four
  named members; the AI data-centre buildout with year-bound capex [goldman-hyperscaler-capex-2026].
- **Defence prime contractors (Lockheed Martin, RTX, Boeing, General Dynamics, Northrop
  Grumman)** — private-sector aggregate named via the DoD top-100 contractor record
  [dod-top100-contractors-list][crs-dod-contractors-primer].
- **Australia** — atomic external actor (author-approved): the one state named in all three
  tiers of the alliance system — ANZUS treaty party, major non-NATO ally, AUKUS partner.

## Deliberately NOT extracted

- South Korea, the Philippines, Thailand, New Zealand — named only as treaty-roster parties
  with no individual action attributed; folded into the treaty-system description (the
  Louisiana precedent). Extract atomically if a later text attributes individual action.
- Fortune, BLS, EPI, the Goldman/Yahoo relay — measurement/citation sources, filter (e).

The private-sector column of the actors index is no longer empty — closing the extraction
run's headline finding.
