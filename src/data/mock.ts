import type { Authorization } from "./types";

/**
 * Sample authorizations standing in for a fetch from the UM system. Patient
 * labels are de-identified descriptors — the UI layer never handles PHI.
 */
export const AUTHORIZATIONS: Authorization[] = [
  // ---------------- NICU ----------------
  {
    id: "AUTH-40921",
    type: "NICU",
    patientLabel: "Neonate · 27wk preterm",
    clinicalSummary:
      "Ventilator support, suspected sepsis. Projected length of stay 48–70 days.",
    estimatedEpisode: { low: 310_000, high: 540_000 },
    riskScore: 91,
    drivers: ["Gestational age 27wk", "Respiratory support code", "Transfer-in status"],
    similar: [
      { id: "AUTH-39004", label: "26wk · vent · sepsis", detail: "NICU", gapDays: 12, match: 0.9 },
      { id: "AUTH-38550", label: "28wk · vent", detail: "NICU", gapDays: 14, match: 0.85 },
      { id: "AUTH-38221", label: "27wk · CPAP", detail: "NICU", gapDays: 19, match: 0.77 },
    ],
    timingConfidence: 0.82,
    nextStep: "Assign a case manager while the length of stay is still open.",
    nextStepCta: "Assign case manager",
  },
  {
    id: "AUTH-40877",
    type: "NICU",
    patientLabel: "Neonate · 34wk, jaundice",
    clinicalSummary: "Phototherapy and feeding support. No respiratory escalation coded.",
    estimatedEpisode: { low: 60_000, high: 95_000 },
    riskScore: 58,
    drivers: ["Gestational age 34wk", "Phototherapy code", "Feeding support"],
    similar: [
      { id: "AUTH-38990", label: "35wk · phototherapy", detail: "NICU", gapDays: 16, match: 0.88 },
      { id: "AUTH-38410", label: "33wk · feeding", detail: "NICU", gapDays: 21, match: 0.79 },
    ],
    timingConfidence: 0.74,
    nextStep: "Review clinical notes for any escalation before it changes the estimate.",
    nextStepCta: "Review clinical notes",
  },

  // ---------------- Oncology ----------------
  {
    id: "AUTH-40810",
    type: "Oncology",
    patientLabel: "CAR-T · relapsed DLBCL",
    clinicalSummary: "Cell therapy plus inpatient CRS monitoring at an in-network center.",
    estimatedEpisode: { low: 475_000, high: 650_000 },
    riskScore: 88,
    drivers: ["Therapy code (CAR-T)", "Prior lines of treatment", "Inpatient site of care"],
    similar: [
      { id: "AUTH-38112", label: "CAR-T · DLBCL · same site", detail: "Oncology", gapDays: 6, match: 0.94 },
      { id: "AUTH-37440", label: "CAR-T · ALL", detail: "Oncology", gapDays: 8, match: 0.89 },
      { id: "AUTH-36981", label: "Cell therapy · myeloma", detail: "Oncology", gapDays: 11, match: 0.81 },
    ],
    timingConfidence: 0.88,
    nextStep: "Route to the high-dollar claims desk and pre-stage reserves.",
    nextStepCta: "Route to high-dollar desk",
  },
  {
    id: "AUTH-40795",
    type: "Oncology",
    patientLabel: "Infusion · metastatic breast",
    clinicalSummary: "Recurring outpatient regimen. Gap pattern suggests monthly claim cadence.",
    estimatedEpisode: { low: 70_000, high: 120_000 },
    riskScore: 62,
    drivers: ["Regimen code", "Recurring outpatient", "Stage IV"],
    similar: [
      { id: "AUTH-37701", label: "Infusion · breast", detail: "Oncology", gapDays: 12, match: 0.9 },
      { id: "AUTH-37200", label: "Infusion · lung", detail: "Oncology", gapDays: 15, match: 0.82 },
    ],
    timingConfidence: 0.79,
    nextStep: "Confirm the regimen schedule to lock the recurring claim cadence.",
    nextStepCta: "Confirm regimen schedule",
  },
  {
    id: "AUTH-40788",
    type: "Oncology",
    patientLabel: "Diagnostic imaging · PET",
    clinicalSummary: "Single-service authorization, no inpatient component expected.",
    estimatedEpisode: { low: 4_000, high: 7_000 },
    riskScore: 22,
    drivers: ["Single service", "Outpatient", "No admission"],
    similar: [
      { id: "AUTH-37010", label: "PET · staging", detail: "Oncology", gapDays: 4, match: 0.95 },
      { id: "AUTH-36800", label: "PET · restaging", detail: "Oncology", gapDays: 6, match: 0.9 },
    ],
    timingConfidence: 0.91,
    nextStep: "Standard track — auto-monitor for the claim, no manual review needed.",
    nextStepCta: "Keep on auto-track",
  },

  // ---------------- Cardiology ----------------
  {
    id: "AUTH-40663",
    type: "Cardiology",
    patientLabel: "CABG · elective, 3-vessel",
    clinicalSummary: "Planned inpatient coronary bypass with two comorbidities coded.",
    estimatedEpisode: { low: 85_000, high: 140_000 },
    riskScore: 64,
    drivers: ["Procedure code (CABG)", "Comorbidity count", "Planned inpatient days"],
    similar: [
      { id: "AUTH-37890", label: "CABG · 3-vessel", detail: "Cardiology", gapDays: 9, match: 0.88 },
      { id: "AUTH-37211", label: "Valve replacement", detail: "Cardiology", gapDays: 13, match: 0.82 },
      { id: "AUTH-36540", label: "CABG · diabetic", detail: "Cardiology", gapDays: 15, match: 0.8 },
    ],
    timingConfidence: 0.8,
    nextStep: "Confirm the scheduled surgery date to tighten the window.",
    nextStepCta: "Confirm surgery date",
  },
  {
    id: "AUTH-40620",
    type: "Cardiology",
    patientLabel: "Diagnostic cath",
    clinicalSummary: "Outpatient diagnostic catheterization, no intervention planned.",
    estimatedEpisode: { low: 9_000, high: 16_000 },
    riskScore: 31,
    drivers: ["Outpatient", "Diagnostic only", "No stent"],
    similar: [
      { id: "AUTH-36990", label: "Diagnostic cath", detail: "Cardiology", gapDays: 5, match: 0.93 },
      { id: "AUTH-36700", label: "Diagnostic cath", detail: "Cardiology", gapDays: 8, match: 0.88 },
    ],
    timingConfidence: 0.9,
    nextStep: "Standard track — auto-monitor for the claim.",
    nextStepCta: "Keep on auto-track",
  },

  // ---------------- Orthopedics ----------------
  {
    id: "AUTH-40501",
    type: "Orthopedics",
    patientLabel: "Total knee replacement",
    clinicalSummary: "Outpatient arthroplasty, elevated BMI flag on record.",
    estimatedEpisode: { low: 32_000, high: 55_000 },
    riskScore: 41,
    drivers: ["Procedure code (TKA)", "Outpatient site", "BMI flag"],
    similar: [
      { id: "AUTH-38970", label: "TKA · outpatient", detail: "Orthopedics", gapDays: 7, match: 0.92 },
      { id: "AUTH-38300", label: "THA · outpatient", detail: "Orthopedics", gapDays: 9, match: 0.9 },
      { id: "AUTH-37655", label: "TKA · inpatient", detail: "Orthopedics", gapDays: 12, match: 0.84 },
    ],
    timingConfidence: 0.85,
    nextStep: "Standard track — auto-monitor for the claim.",
    nextStepCta: "Keep on auto-track",
  },

  // ---------------- Behavioral Health ----------------
  {
    id: "AUTH-40388",
    type: "Behavioral Health",
    patientLabel: "Inpatient psychiatric admission",
    clinicalSummary: "Acute inpatient level of care, prior 90-day utilization on record.",
    estimatedEpisode: { low: 40_000, high: 78_000 },
    riskScore: 66,
    drivers: ["Level of care (acute inpatient)", "Admission type", "Prior 90-day utilization"],
    similar: [
      { id: "AUTH-39120", label: "Acute inpatient · MDD", detail: "Behavioral Health", gapDays: 10, match: 0.86 },
      { id: "AUTH-38760", label: "PHP step-down", detail: "Behavioral Health", gapDays: 16, match: 0.79 },
      { id: "AUTH-38010", label: "Inpatient · dual dx", detail: "Behavioral Health", gapDays: 21, match: 0.74 },
    ],
    timingConfidence: 0.72,
    nextStep: "Review the level-of-care plan — step-downs shift the claim window.",
    nextStepCta: "Review level of care",
  },

  // ---------------- Transplant ----------------
  {
    id: "AUTH-40244",
    type: "Transplant",
    patientLabel: "Liver transplant · listed",
    clinicalSummary: "Listed for deceased-donor liver; projected inpatient plus follow-up.",
    estimatedEpisode: { low: 570_000, high: 640_000 },
    riskScore: 93,
    drivers: ["Organ type (liver)", "Listing status", "Projected inpatient + follow-up"],
    similar: [
      { id: "AUTH-35990", label: "Liver · deceased donor", detail: "Transplant", gapDays: 19, match: 0.91 },
      { id: "AUTH-35120", label: "Liver · living donor", detail: "Transplant", gapDays: 24, match: 0.83 },
      { id: "AUTH-34400", label: "Kidney-pancreas", detail: "Transplant", gapDays: 28, match: 0.78 },
    ],
    timingConfidence: 0.7,
    nextStep: "Flag for reserve planning — timing depends on organ availability.",
    nextStepCta: "Flag for reserve planning",
  },
  {
    id: "AUTH-40190",
    type: "Transplant",
    patientLabel: "Kidney transplant · living donor",
    clinicalSummary: "Scheduled living-donor kidney transplant with matched donor.",
    estimatedEpisode: { low: 260_000, high: 320_000 },
    riskScore: 84,
    drivers: ["Organ type (kidney)", "Living donor", "Scheduled date on file"],
    similar: [
      { id: "AUTH-35400", label: "Kidney · living donor", detail: "Transplant", gapDays: 9, match: 0.92 },
      { id: "AUTH-34980", label: "Kidney · living donor", detail: "Transplant", gapDays: 12, match: 0.87 },
    ],
    timingConfidence: 0.86,
    nextStep: "Route to the high-dollar claims desk and pre-stage reserves.",
    nextStepCta: "Route to high-dollar desk",
  },
];
