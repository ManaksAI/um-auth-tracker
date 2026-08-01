import type { Authorization } from "../data/types";
import { fmtBand, severityTier, tierLabel } from "../lib/severity";

/**
 * The two independent "high-dollar" signals, side by side: estimated episode
 * dollars and the composite clinical risk score. They can disagree, and seeing
 * both is the point — the overall tier takes the more severe of the two.
 */
export function DualSeverity({ auth, compact = false }: { auth: Authorization; compact?: boolean }) {
  const tier = severityTier(auth);
  return (
    <div className={`dual ${compact ? "dual--compact" : ""}`}>
      <div className="dual__cell">
        <div className="dual__label">Estimated episode</div>
        <div className="dual__value">{fmtBand(auth.estimatedEpisode)}</div>
      </div>
      <div className="dual__div" aria-hidden="true" />
      <div className="dual__cell">
        <div className="dual__label">Clinical risk</div>
        <div className="dual__value">
          {auth.riskScore}
          <span className="dual__unit">/100</span>
        </div>
        <div className="riskbar" aria-hidden="true">
          <i style={{ width: `${auth.riskScore}%` }} data-tier={tier} />
        </div>
      </div>
      {!compact && (
        <>
          <div className="dual__div" aria-hidden="true" />
          <div className="dual__cell dual__cell--tier">
            <div className="dual__label">Severity</div>
            <span className={`sevpill sevpill--${tier}`}>{tierLabel(tier)}</span>
          </div>
        </>
      )}
    </div>
  );
}
