// Domain model for UM (Utilization Management) authorization tracking.

/** Clinical service line an authorization is grouped under. */
export type AuthType =
  | "NICU"
  | "Oncology"
  | "Cardiology"
  | "Orthopedics"
  | "Behavioral Health"
  | "Transplant";

/** Severity tier for a predicted episode. Encoded by tone/weight, never hue. */
export type SeverityTier = "critical" | "elevated" | "standard";

/** A confidence-bounded range in whole dollars. */
export interface DollarBand {
  low: number;
  high: number;
}

/** A confidence-bounded range in whole days from "now". */
export interface DayWindow {
  low: number;
  high: number;
  median: number;
}

/**
 * A historical authorization matched to an open one, used as evidence for the
 * claim-timing prediction. `gapDays` is the observed auth→claim submission gap.
 */
export interface SimilarAuth {
  id: string;
  label: string;
  detail: string;
  gapDays: number;
  match: number; // 0..1 similarity
}

/** A single open pre-authorization request. */
export interface Authorization {
  id: string;
  type: AuthType;
  patientLabel: string; // de-identified descriptor, never PHI in the UI layer
  clinicalSummary: string;
  /** Model-estimated total episode cost. */
  estimatedEpisode: DollarBand;
  /** Composite clinical risk score, 0–100. */
  riskScore: number;
  /** Top model drivers, human-readable. */
  drivers: string[];
  /** Historical authorizations backing the prediction. */
  similar: SimilarAuth[];
  /** Model confidence in the claim-timing prediction, 0..1. */
  timingConfidence: number;
  /** Directed next action for the reviewer. */
  nextStep: string;
  nextStepCta: string;
}
