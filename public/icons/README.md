# App icons

Four minimalist icon concepts for the UM Auth Tracker, each drawn from the app's
own visual language. All are **monochromatic and theme-aware** — a single
`prefers-color-scheme` query inside each SVG flips the tile and mark:

- **Light OS theme** → ink tile (`#16181b`) + paper mark (`#f4f5f6`)
- **Dark OS theme** → paper tile + ink mark

Severity tone is carried by `opacity`, never a second hue — same rule as the app.

| File | Concept | Idea |
| --- | --- | --- |
| `icon-a.svg` | **Triage stack** | Three descending bars in descending tone (the severity mix as a ranked queue) + a node for the active case. **Live favicon.** |
| `icon-b.svg` | **Timeline node** | A severity node on the claim track, inside its confidence band, with the "now" tick — the prediction view as one mark. |
| `icon-c.svg` | **Auth–claim gap** | The authorization (bar) and the claim (node) joined by a measured span — the auth→claim gap, now reinforced by the reconciliation view. |
| `icon-d.svg` | **Priority chevrons** | Stacked chevrons in descending tone; reads as priority/escalation. The most iconographic, least domain-specific. |

The live favicon is [`public/icon.svg`](../icon.svg), a copy of **concept A**, wired
in `index.html` as `icon` + `apple-touch-icon`. To switch the app to a different
concept, copy that file over `public/icon.svg`:

```bash
cp public/icons/icon-c.svg public/icon.svg   # e.g. switch to the gap mark
```

Regenerate all five files with `scratchpad/gen-prod-icons.mjs` (kept outside the
repo). Apple touch icons ideally ship as PNG; the SVG works for modern browsers —
add a rasterized `apple-touch-icon.png` if you need older iOS support.
