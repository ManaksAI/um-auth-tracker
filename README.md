# UM Authorization Tracker

Front-end for Utilization Management prior-authorization tracking. Fetches open
authorizations, classifies them by clinical type (NICU, Oncology, Transplant, …),
grades each by episode severity, and predicts when the resulting claim will be
submitted — from the auth→claim gaps of similar historical authorizations.

Monochromatic by design: **severity is encoded by tone and weight, never hue.**
No tabular data grids — everything is card-, worksheet-, or timeline-based.

## Three views

| View | Role | What it answers |
| --- | --- | --- |
| **Priority Queue** | Landing | What do I work next? Ranked stream, grouped by type, most-severe first. |
| **Case Console** | Working screen | Why this severity and this timing? Dual severity signals + the similar auths behind the prediction + the claim window. |
| **Claim Timeline** | Planning | When is high-dollar volume landing, and where does it cluster? Auths plotted by predicted claim date, one lane per type. |

Cases open from the Queue or Timeline route straight into the Console.

## Severity model

"High-dollar episode" is two independent signals, shown side by side because
they can diverge:

- **Estimated episode cost** — a dollar band, thresholded into Critical / Elevated / Standard.
- **Clinical risk score** — a composite 0–100, thresholded independently.

The overall tier is the more severe of the two. Thresholds live in
[`src/lib/severity.ts`](src/lib/severity.ts).

## Claim-timing prediction

For each open auth, [`src/lib/predict.ts`](src/lib/predict.ts) takes the
auth→claim gaps of its similar historical authorizations, weights each by
similarity, and returns a window (weighted median ± a spread that widens as
model confidence drops).

## Structure

```
src/
  data/types.ts     domain model
  data/mock.ts      sample authorizations (stands in for the UM fetch)
  lib/severity.ts   severity tiering + money formatting
  lib/predict.ts    claim-window prediction from similar auths
  components/        DualSeverity, PriorityFeed, SplitConsole, Timeline
  styles/           tokens (monochromatic, theme-aware) + component CSS
```

The data layer is mock. To go live, replace `AUTHORIZATIONS` with a fetch and
feed real model outputs into `estimatedEpisode`, `riskScore`, `similar`, and
`timingConfidence`; every view is a pure function of that shape.

## Run

```bash
npm install
npm run dev      # http://localhost:5187
npm run lint     # typecheck
npm run build    # typecheck + production build
```

React + TypeScript + Vite. Light and dark themes both supported.
