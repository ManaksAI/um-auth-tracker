import type { Authorization, DollarBand, SeverityTier } from "../data/types";

/**
 * Two independent signals define "high-dollar episode": the estimated dollar
 * cost and the composite clinical risk score. They can diverge — a low-cost
 * service on a fragile patient scores high on risk but low on dollars — so we
 * surface both and derive the tier from whichever is more severe.
 */

/** Dollar thresholds (episode midpoint) for tiering. */
const DOLLAR_CRITICAL = 250_000;
const DOLLAR_ELEVATED = 50_000;

/** Risk-score thresholds for tiering. */
const RISK_CRITICAL = 75;
const RISK_ELEVATED = 45;

export function bandMidpoint(band: DollarBand): number {
  return Math.round((band.low + band.high) / 2);
}

function dollarTier(band: DollarBand): SeverityTier {
  const mid = bandMidpoint(band);
  if (mid >= DOLLAR_CRITICAL) return "critical";
  if (mid >= DOLLAR_ELEVATED) return "elevated";
  return "standard";
}

function riskTier(score: number): SeverityTier {
  if (score >= RISK_CRITICAL) return "critical";
  if (score >= RISK_ELEVATED) return "elevated";
  return "standard";
}

const TIER_RANK: Record<SeverityTier, number> = {
  standard: 0,
  elevated: 1,
  critical: 2,
};

/** The overall tier is the more severe of the two signals. */
export function severityTier(auth: Authorization): SeverityTier {
  const d = dollarTier(auth.estimatedEpisode);
  const r = riskTier(auth.riskScore);
  return TIER_RANK[d] >= TIER_RANK[r] ? d : r;
}

export function tierLabel(tier: SeverityTier): string {
  return tier === "critical" ? "Critical" : tier === "elevated" ? "Elevated" : "Standard";
}

/** Sort key: most severe first, then by dollar midpoint. */
export function severityRank(auth: Authorization): number {
  return TIER_RANK[severityTier(auth)] * 1_000_000 + bandMidpoint(auth.estimatedEpisode) / 1000;
}

/** Compact currency, e.g. $310K / $1.2M. */
export function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

export function fmtBand(band: DollarBand): string {
  return `${fmtMoney(band.low)}–${fmtMoney(band.high)}`;
}
