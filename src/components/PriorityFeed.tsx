import type { Authorization, AuthType } from "../data/types";
import { fmtBand, severityRank, severityTier, tierLabel } from "../lib/severity";
import { fmtWindow, predictWindow } from "../lib/predict";

/**
 * Concept A — the landing queue. One ranked stream, grouped by authorization
 * type, most-severe first within each group. Every card ends in one action.
 */
export function PriorityFeed({
  auths,
  onOpenCase,
}: {
  auths: Authorization[];
  onOpenCase: (type: AuthType, id: string) => void;
}) {
  const groups = groupByType(auths);
  const critical = auths.filter((a) => severityTier(a) === "critical").length;

  return (
    <div className="feed">
      <aside className="feed__rail">
        <div className="railcard">
          <div className="railcard__big">{critical}</div>
          <div className="railcard__lbl">Critical episodes open</div>
        </div>
        <div className="railcard">
          <div className="railcard__lbl" style={{ marginBottom: 12 }}>
            Severity mix
          </div>
          <SeverityMix auths={auths} />
        </div>
        <div className="railcard">
          <div className="sevkey" style={{ flexDirection: "column", alignItems: "flex-start", gap: 9 }}>
            <span>
              <i style={{ background: "var(--sev-crit)" }} /> Critical episode
            </span>
            <span>
              <i style={{ background: "var(--sev-elev)" }} /> Elevated
            </span>
            <span>
              <i style={{ background: "var(--sev-std)" }} /> Standard
            </span>
          </div>
        </div>
      </aside>

      <div className="feed__stream">
        {groups.map(([type, list]) => (
          <section key={type}>
            <div className="grouphead">
              <h3>{type}</h3>
              <span className="mono grouphead__count">{list.length} open</span>
              <span className="grouphead__rule" />
            </div>
            {list.map((auth) => (
              <FeedCard key={auth.id} auth={auth} onOpen={() => onOpenCase(auth.type, auth.id)} />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

function FeedCard({ auth, onOpen }: { auth: Authorization; onOpen: () => void }) {
  const tier = severityTier(auth);
  const window = predictWindow(auth);
  return (
    <article className={`fcard fcard--${tier}`}>
      <div className="fcard__stripe" aria-hidden="true" />
      <div className="fcard__body">
        <div className="fcard__top">
          <span className="fcard__name">{auth.patientLabel}</span>
          <span className="mono fcard__id">{auth.id}</span>
          <span className={`sevpill sevpill--${tier}`}>{tierLabel(tier)}</span>
        </div>
        <p className="fcard__clin">
          Est. episode <b>{fmtBand(auth.estimatedEpisode)}</b> · risk <b>{auth.riskScore}/100</b>.{" "}
          {auth.clinicalSummary} <span className="fcard__drivers">Drivers: {auth.drivers.join(", ")}.</span>
        </p>
      </div>
      <div className="fcard__side">
        <span className="fcard__predlbl">Predicted claim</span>
        <span className="mono fcard__predval">{fmtWindow(window)}</span>
        <span className="fcard__conf">
          Confidence {Math.round(auth.timingConfidence * 100)}% · {auth.similar.length} like cases
        </span>
        <button className="step" onClick={onOpen}>
          {auth.nextStepCta} <span className="arrow">→</span>
        </button>
      </div>
    </article>
  );
}

function SeverityMix({ auths }: { auths: Authorization[] }) {
  const counts = { critical: 0, elevated: 0, standard: 0 };
  auths.forEach((a) => (counts[severityTier(a)] += 1));
  const total = auths.length || 1;
  const rows: Array<[string, number, string]> = [
    ["Critical", counts.critical, "var(--sev-crit)"],
    ["Elevated", counts.elevated, "var(--sev-elev)"],
    ["Standard", counts.standard, "var(--sev-std)"],
  ];
  return (
    <div className="mix">
      {rows.map(([label, n, color]) => (
        <div className="mix__row" key={label}>
          <span className="mix__lbl">{label}</span>
          <span className="mix__bar">
            <i style={{ width: `${(n / total) * 100}%`, background: color }} />
          </span>
          <span className="mono mix__n">{n}</span>
        </div>
      ))}
    </div>
  );
}

function groupByType(auths: Authorization[]): Array<[AuthType, Authorization[]]> {
  const map = new Map<AuthType, Authorization[]>();
  for (const a of auths) {
    const arr = map.get(a.type) ?? [];
    arr.push(a);
    map.set(a.type, arr);
  }
  // Groups ordered by their most-severe member; cards within, most-severe first.
  return [...map.entries()]
    .map(([type, list]) => {
      list.sort((x, y) => severityRank(y) - severityRank(x));
      return [type, list] as [AuthType, Authorization[]];
    })
    .sort((a, b) => severityRank(b[1][0]!) - severityRank(a[1][0]!));
}
