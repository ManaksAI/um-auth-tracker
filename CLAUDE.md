# CLAUDE.md

Guidance for Claude Code (and humans) working in this repo.

## What this is

A front-end for **Utilization Management (UM) prior-authorization tracking**. It
fetches open authorizations, classifies them by clinical type, grades each by
**episode severity**, and predicts **when the resulting claim will be submitted**
from the auth→claim gaps of similar historical authorizations.

Stack: **React 18 + TypeScript + Vite**. No backend in this repo — the data layer
is mock and is the seam where a real UM feed plugs in.

## Commands

```bash
npm install
npm run dev      # dev server on http://localhost:5187
npm run lint     # tsc --noEmit (strict) — the typecheck gate
npm run build    # lint + vite production build
npm run preview  # serve the built dist/
```

`npm run lint` is the fast correctness check — run it after any change. Strict
mode is on, including `noUnusedLocals`/`noUnusedParameters` and
`noUncheckedIndexedAccess`, so unused symbols and unchecked index access fail.

## Architecture

Every view is a **pure function of the `Authorization[]` data**. There is no
store and no side-effecting data layer — swap the mock array for a fetch and the
UI follows.

```
src/
  data/types.ts     Authorization + supporting types — the single contract
  data/mock.ts      sample authorizations (stands in for the UM system fetch)
  lib/severity.ts   severity tiering (dollar + risk) + currency formatting
  lib/predict.ts    claim-window prediction from similar auths
  components/
    DualSeverity.tsx   dollar estimate + risk score, side by side
    PriorityFeed.tsx   View 1 — landing queue
    SplitConsole.tsx   View 2 — master-detail working screen
    Timeline.tsx       View 3 — planning timeline
  styles/
    tokens.css       monochromatic, theme-aware design tokens
    global.css       shell + shared component styles
    components.css    per-view styles
  App.tsx            view switching + shared selection
  main.tsx           entry
```

### The three views (shared state in `App.tsx`)

- **Priority Queue** (`PriorityFeed`) — ranked stream grouped by auth type,
  most-severe first. The landing view.
- **Case Console** (`SplitConsole`) — pick a type, get a single-case worksheet:
  dual severity, the similar historical auths behind the prediction, the claim
  window, and the next step.
- **Claim Timeline** (`Timeline`) — every auth plotted by predicted claim date,
  one lane per type; node size = severity, faint band = confidence range.

Opening a case from the Queue or Timeline sets `selectedType` and switches to the
Console — that's the whole navigation model.

## Domain logic (the parts that are "real")

**Severity — `lib/severity.ts`.** "High-dollar episode" is *two independent
signals*, shown side by side because they can diverge:
- `estimatedEpisode` (a dollar band) → tiered at `DOLLAR_CRITICAL` / `DOLLAR_ELEVATED`.
- `riskScore` (0–100) → tiered at `RISK_CRITICAL` / `RISK_ELEVATED`.
The overall tier (`severityTier`) is the **more severe of the two**. Change the
thresholds here, in one place.

**Prediction — `lib/predict.ts`.** `predictWindow` takes an auth's `similar`
records, weights each historical `gapDays` by its `match`, and returns a window:
weighted median ± a spread that widens as `timingConfidence` drops.
`timelinePosition` and `landingWithin` are derived helpers for the timeline and
the masthead stats.

## Going live (replacing the mock)

Replace `AUTHORIZATIONS` in `data/mock.ts` with a fetch that returns the same
`Authorization` shape. Feed real model outputs into `estimatedEpisode`,
`riskScore`, `similar` (with observed `gapDays`), and `timingConfidence`. Nothing
in the components or `lib/` needs to change. Keep PHI out of the UI layer —
`patientLabel` is a de-identified descriptor by design.

## Design constraints (locked — do not regress)

These were explicit product requirements; keep them when editing UI:
- **Monochromatic.** Severity is encoded by **tone and weight, never hue**. The
  one accent (`--accent`, a cool ink) is reserved for interactive + next-step
  affordances. Semantic color is not used.
- **No tabular / spreadsheet layouts.** Data lives in cards, worksheets, and the
  timeline — never rows-and-columns grids.
- **Minimalist, no emoticons.** Every surface ends in a crisp next-step direction.
- **Theme-aware.** Tokens are defined for light and dark via
  `prefers-color-scheme` and `:root[data-theme=...]`. Style through tokens, never
  hard-coded colors. Both themes must stay legible.

## Conventions

- Components are function components; keep view logic pure and derive from props.
- Formatting/tiering/prediction live in `lib/` — don't inline them in components.
- Match the existing token-driven CSS; add view styles to `styles/components.css`.
