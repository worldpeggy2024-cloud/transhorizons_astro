# Country Report — Trajectory (Extrapolation) Template

*The second of two layers. Separate template, separate contract.*
*Built on the sourced present-state report; openly speculative.*

> **LAYER: Trajectory / extrapolation.** This is **not** the present-state report and is **not** governed by
> `research-quality-bar.md`. It is governed by **this document's** contract: declared bias, named
> assumptions, plural by design, every forward-claim anchored to a present-state fact.
>
> **Built on:** the country's present-state report (`country-report-present-state-template.md` output), which
> is sourced and verified. This layer reasons *forward from* those facts; it does not introduce new sourced
> claims.
>
> **Architecture (why this layer exists):** the present-state report is the **involution** layer — the dive
> down into material fact. The trajectory layer is where it **turns and carries back up (evolution)** — "what
> could be, where the rot could get fixed." It is the **hinge** between the TransHorizons research layer and
> the Virtual Light narrative layer, built *into* the report's architecture, not bolted on. (See §5: it is
> the possibility-space the authored Lou scene later selects one branch from — it is **not** that scene.)

---

## 1. The contract (must render to the reader)

A standard, visible preamble at the top of every trajectory block — non-negotiable, so no reader mistakes
this for sourced analysis:

> *This is extrapolation, not a sourced claim. It reasons forward from the facts in the present-state report
> above. It carries a declared bias and named assumptions, stated below. It is plural by design — these are
> possible trajectories, not a forecast.*

Then, per country:

- `declaredBias` — the analyst's named lens (e.g. "reads multipolar realignment as the base condition;
  treats demographic momentum as harder to reverse than fiscal policy"). State it; don't pretend neutrality.
- `namedAssumptions[]` — the load-bearing assumptions, each explicit and contestable (e.g. "assumes no
  large-scale external military shock in the horizon"; "assumes the youth cohort's current digital-adoption
  rate holds").
- `horizon` — the time window, stated (e.g. "≈ one generation, to ~2050"). Different trajectories may run on
  the same horizon; say so.

---

## 2. Plural by design *(B.1)*

**At least 2-4 trajectories. No single headline forecast. No "most likely future."** Honesty lives in the
plurality; collapsing to one future misrepresents what extrapolation is.

You may describe **what pulls between** the trajectories (the `tensions` field, §6). You may **not** rank
them into one answer or attach probabilities that read as fact. Qualitative "what would make this more or
less plausible" is allowed inside each trajectory's `conditions`; a portfolio-level "the country will most
likely…" is not.

---

## 3. The one hard discipline: ANCHORING *(B.3)*

This layer is **loose on sourcing, strict on anchoring.** Every forward-claim **names the present-state fact
it reasons forward from.**

- **Syntax:** `↳ anchor: society.demographics, economy.externalVulnerability`
- The anchor must point to a field that **actually exists in this country's present-state report.** With the
  six-peer present-state layer, the anchor namespace now spans `political.* · economy.* · territory.* ·
  capacity.* · society.* · security.*` (a future `validate:trajectory` gate can enforce existence
  mechanically — see the playbook breakage note).
- **The leash, stated plainly — the structural parallel to the present-state layer:**
  > In the present-state layer, a claim without a `[source-id]` is **noise**.
  > In the trajectory layer, a forward-claim without a present-state **anchor** is **untethered preference**.
  > Same failure, one layer up.

**Reason forward ONLY from:**
1. the country's **own latent levers** — its potential energy, already present in the present-state facts;
2. its **people's already-visible reaching** — movement the population is *already* making (a demand, a
   migration pattern, an adoption curve, a youth movement) **evidenced in the present-state report**, not
   asserted.

**NEVER reason from an external preference about where the country *should* go.** This is **refusal-not-
removal applied to time**: surface the country's own potential energy; do not assign it a destiny. No
external actor (and no analyst) is cast as the agent of the country's future. This is the guard against the
saviorism the project's whole posture rejects — the same logic as the AI that withdraws an exemption rather
than choosing who falls.

---

## 4. The two substrates it reasons from *(B.4, extended)*

The deepest future-shaping forces are slower and deeper than this year's fiscal deficit. There are now **two**
such substrates, and an honest trajectory leads from both, not just one.

**4a. Society is the human substrate.** Demographic structure, religious-demographic trajectory, youth
structure, and cohesion move slower and cut deeper than cyclical facts. Lead extrapolation from `society.*`
anchors; treat fiscal and cyclical facts as faster surface weather on top of it.

**4b. Territory is the physical substrate.** `territory.climate`, `territory.metabolism`, `territory.minerals`,
and `territory.biosphere` are the material ground every trajectory runs on — the physical facts that outlast
any government. The climate/energy trajectory of a country reasons forward from `territory.climate` and
`territory.metabolism`, not from an external decarbonization preference. For a resource state, the
critical-mineral endowment (`territory.minerals`) is a latent lever the same way a youth bulge is: potential
energy that a trajectory either activates or leaves in the ground.

**A trajectory anchored only to this year's deficit — and to no `society.*` or `territory.*` field — is almost
certainly too shallow to be honest.**

---

## 4c. Capacity is the primary branching variable *(the project's spine, made operational)*

This is the load-bearing addition. The project's unifying principle is **knowledge isn't the constraint,
capacity is** — foresight is universal; what separates the adapted from the drowned is who can afford, permit,
and build. The present-state layer now has a `capacity.*` peer (permitting, delivery, productivity). **That
field is the trajectory layer's primary branching variable.**

- Two countries facing the same `territory.climate` exposure diverge on `capacity.*`, not on foresight. The
  branch a country lands in is determined first by whether it can *execute* — build the defence, permit the
  mine, deliver the grid — not by whether it knows what's coming.
- So the standard trajectory set is often best organised as a **capacity fork**: a branch where the latent
  capacity is unlocked (barriers fall, delivery record improves, value-add processing gets built) versus a
  branch where the same knowledge and the same endowment sit inert behind a permitting vacuum and an
  infrastructure deficit. Same facts, opposite outcome; `capacity.*` is the variable.

**The moral guard on capacity-branching (mandatory — do not omit).** Making capacity the branching variable
must NOT collapse into "high-capacity countries win, low-capacity countries lose, and each deserves it."
CORE is explicit: the split between the adapted and the drowned "was not knowledge and not fundamentally
desert — it was capacity, distributed by history, colonialism, resource geography, and luck." Therefore:

- Capacity determines *who adapts*; it never determines *who deserves to*. A low-capacity trajectory is a
  story of unjust distribution, not of a country failing a test it was fairly set.
- Name *why* the capacity is where it is (colonial resource geography, extractive terms of trade, deliberate
  underdevelopment) when the present-state facts support it. Capacity is inherited, not earned.
- Never read a capacity gap as a merit gap. That inversion is the just-world story the project exists to
  refuse — the trajectory-layer form of the saviorism guard.

**Constitutional-substrate gate (settler states).** Where `political.constitutionalSubstrate` is present, a
resource-development or land-use trajectory is gated by title and the consent substrate, not by
capacity-in-the-abstract. A branch that activates `territory.minerals` while ignoring the title anchor is
untethered preference — it reasons from an outside wish, not the country's own legal ground. Anchor such
branches to the constitutional substrate and hold the two substrates (historic-treaty / modern-agreement vs
unceded, title-litigated) distinct, exactly as the present-state layer does.

---

## 5. The Wall — trajectory ≠ authored scene *(B.2)*

| | Trajectory layer (this template) | Authored Lou scene (Virtual Light) |
|---|---|---|
| Form | Plural, analytical possibility-space | Singular, committed to one branch |
| Commitment | Stays plural; never picks | Picks one branch (the better branch — where the rot got fixed) |
| Register | Reasoning, anchored, labelled extrapolation | Fiction, authored, lived |
| Surfaced by | The **plural-extrapolation** toggle | The **standard Virtual Light** link |

**Never merge the multiverse into the one authored scene, and never collapse the plural space into a single
branch inside this template.** The relationship is one-directional: this layer is the space; the scene draws
one branch *from* it. (How the two are surfaced on the page is **out of scope** for this template — it's
handled by the existing Virtual Light toggle mechanism.)

---

## 6. Structure (per country)

```yaml
trajectory:
  contract:
    label: "Extrapolation — not a sourced claim"
    builtOnPresentState: "[CODE] present-state report, v[X] / [YYYY-MM-DD]"  # pins which facts this stands on
    declaredBias: "…"            # the named lens (§1)
    namedAssumptions:            # explicit, contestable (§1)
      - "…"
    horizon: "…"                 # stated window (§1)

  latentLevers:                  # the country's OWN potential energy — each anchored (§3, §4)
    - lever: "…"
      anchor: [society.demographics, territory.minerals, …]   # present-state field(s) it reads from
      alreadyVisibleReaching: "…"            # movement the people are ALREADY making, evidenced from present-state
      constraint: "…"                        # what currently holds the lever down (often a capacity.* fact)

  trajectories:                  # PLURAL — 2 to 4; no single forecast (§2)
    - name: "…"
      activatesLevers: ["…"]                 # which latent levers this path turns on
      capacityFork: "…"                      # the capacity.* condition that separates this branch from its sibling (§4c)
      conditions: "what would have to hold / what would have to break"
      anchors: [capacity.permitting, territory.climate, society.cohesion, …]   # every forward-claim's anchor
      livedTexture: "…"                      # the consequence in human terms — the hinge toward VL (§7)

  tensions: "what pulls between the trajectories; why they stay plural rather than resolving to one"

  guard:                         # ALL must pass before publish (§3, §4)
    - "every forward-claim anchored to an existing present-state field"
    - "no claim reasons from an external preference about where the country should go"
    - "no external actor (or the analyst) cast as the agent of the country's future"
    - "trajectories remain plural — no single headline forecast, no probabilities read as fact"
    - "'already-visible reaching' is evidenced from the present-state, not asserted"
    - "at least one trajectory leads from a society.* anchor (human substrate)"
    - "at least one trajectory leads from a territory.* anchor (physical substrate)"
    - "where trajectories fork on capacity, the capacity gap is framed as inherited/distributed, never as merit or desert"
    - "any resource/land trajectory in a settler state is anchored to political.constitutionalSubstrate, substrates held distinct"
```

---

## 7. `livedTexture` — the hinge, handled carefully

`livedTexture` renders the consequence in human terms — the evolution turn, the felt social extrapolation
Servigne said only fiction attempts. **But here it stays plural and anchored.** It is the raw material the
authored Lou scene later draws **one** branch from; it is **not** yet the scene.

Discipline for `livedTexture`:
- It still reasons; it does not yet invent characters or commit to a single world.
- It stays anchored — the texture is the *consequence of an anchored lever*, not free atmosphere.
- It keeps the project's no-preaching rule: show the consequence of the country's own reaching; don't
  moralise about where it ought to land.
- **The capacity gap is felt, not judged.** Where a branch turns on capacity, render the lived difference
  between the adapted and the stranded (the same knowledge, the opposite outcome — rich Montréal funds the
  flood defence, poor Montréal watches the same spring ice it also saw coming). Show the injustice of the
  distribution as texture; never let it read as the stranded having deserved it.

This is exactly the seam between the layers: the present-state report states the fact and the map; this layer
reasons forward to the plural lived weather of those facts; the authored scene commits to one.

---

## 8. What this layer is **NOT**

- **Not sourced.** Don't fake citations — anchors are not sources. (If you find yourself wanting a
  `[source-id]`, the claim is really a present-state claim; move it down a layer.)
- **Not a forecast.** No probabilities masquerading as fact; qualitative plausibility at most, always plural.
- **Not a destiny, and not a "should."** The anti-saviorism guard (§3) is the hard line.
- **Not a meritocracy.** The capacity-branching moral guard (§4c) is its own hard line: a capacity gap is an
  inherited, unjustly distributed fact, never a verdict on desert.
- **Not the authored scene.** The wall (§5) is the hard line.

---

*End of trajectory template. The present-state layer it stands on is governed by `research-quality-bar.md`;
this layer is governed by the contract above.*
