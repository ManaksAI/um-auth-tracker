# App icons

Minimalist icon concepts for the UM Auth Tracker, each drawn from the app's own
visual language. All are **monochromatic and theme-aware** — a single
`prefers-color-scheme` query inside each SVG flips the tile and mark:

- **Light OS theme** → ink tile (`#16181b`) + paper mark (`#f4f5f6`)
- **Dark OS theme** → paper tile + ink mark

Tone is carried by `opacity`, never a second hue — same rule as the app.

Families are kept here. The **live favicon** is
[`public/icon.svg`](../icon.svg) = **Insight engine, clean** (`insight-clean.svg`).

## Insight-engine family — the product thesis as a mark

The core idea: a **case** (triangle) is **churned through the model** (spiral) to
generate **insights** (lines fanning out in descending tone). Came from a hand
sketch — the triangle is the case feeding in.

| File | Treatment | Idea |
| --- | --- | --- |
| `insight-clean.svg` | **Clean** | Geometric case → spiral → three descending insight lines. **Live favicon.** |
| `insight-pennant.svg` | **Pennant case** | Same engine, case drawn as the pennant from the original sketch. |
| `insight-sketch.svg` | **Hand-drawn** | The clean mark with a light roughen filter — drawn-by-hand feel. |

## Valve family — prior auth as a valve that gates the flow of claims

| File | Concept | Idea |
| --- | --- | --- |
| `valve-gate.svg` | **Gate valve** | The gate-valve symbol (bowtie) on a rising stem with a handwheel. Reads as valve, gate, and hourglass — valve + claim-timing in one mark. **Live favicon.** |
| `valve-wheel.svg` | **Handwheel** | A valve wheel face-on: ring, spokes, hub. The most unmistakably "valve." |
| `valve-profile.svg` | **Profile valve** | Round body + aperture + side outlet; the closest nod to the Valve-logo composition without copying its trademarked mark. |
| `valve-flow.svg` | **Flow control** | A flow line pinched at a valve, solid in and faint out — authorization gating the flow of claims. |

## Abstract family — the app's data language

| File | Concept | Idea |
| --- | --- | --- |
| `icon-a.svg` | **Triage stack** | Descending bars in descending tone + a node for the active case. |
| `icon-b.svg` | **Timeline node** | A severity node on the claim track inside its confidence band. |
| `icon-c.svg` | **Auth–claim gap** | Authorization (bar) and claim (node) joined by a measured span. |
| `icon-d.svg` | **Priority chevrons** | Stacked chevrons in descending tone; priority/escalation. |

## Switching the live icon

The favicon is just a copy of one concept. To switch, copy it over
`public/icon.svg` (referenced by `index.html` as `icon` + `apple-touch-icon`):

```bash
cp public/icons/valve-wheel.svg public/icon.svg   # e.g. switch to the handwheel
```

Regenerate the valve set with `scratchpad/gen-prod-valve.mjs` and the abstract set
with `scratchpad/gen-prod-icons.mjs` (both kept outside the repo). Apple touch
icons ideally ship as PNG; the SVG works for modern browsers — add a rasterized
`apple-touch-icon.png` if you need older-iOS home-screen support.
