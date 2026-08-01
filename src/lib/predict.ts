import type { Authorization, DayWindow, SimilarAuth } from "../data/types";

/**
 * Predict the claim-submission window for an open authorization from the
 * auth→claim gaps observed in its similar historical authorizations.
 *
 * Each historical gap is weighted by that record's similarity to the open auth,
 * so closer matches pull the estimate harder. The window is the weighted median
 * plus a spread that widens as timing confidence drops.
 */
export function predictWindow(auth: Authorization): DayWindow {
  const sims = auth.similar;
  if (sims.length === 0) return { low: 0, high: 0, median: 0 };

  const median = weightedMedian(sims);

  // Spread of the historical gaps, tightened by model confidence.
  const gaps = sims.map((s) => s.gapDays);
  const spread = (Math.max(...gaps) - Math.min(...gaps)) / 2;
  const slack = spread * (1 - auth.timingConfidence) + 2;

  return {
    median: Math.round(median),
    low: Math.max(0, Math.round(median - slack)),
    high: Math.round(median + slack),
  };
}

function weightedMedian(sims: SimilarAuth[]): number {
  const sorted = [...sims].sort((a, b) => a.gapDays - b.gapDays);
  const total = sorted.reduce((sum, s) => sum + s.match, 0);
  let running = 0;
  for (const s of sorted) {
    running += s.match;
    if (running >= total / 2) return s.gapDays;
  }
  return sorted[sorted.length - 1]!.gapDays;
}

/** Human phrasing for a window, e.g. "In 9–14 days". */
export function fmtWindow(w: DayWindow): string {
  if (w.low === w.high) return `In ${w.low} days`;
  return `In ${w.low}–${w.high} days`;
}

/**
 * Position of a window's median on a 0..1 scale across `horizonDays`, for
 * placing nodes on the planning timeline.
 */
export function timelinePosition(w: DayWindow, horizonDays: number): number {
  return Math.min(1, Math.max(0, w.median / horizonDays));
}

/** Count authorizations whose predicted claim lands within `days`. */
export function landingWithin(auths: Authorization[], days: number): number {
  return auths.filter((a) => predictWindow(a).median <= days).length;
}
