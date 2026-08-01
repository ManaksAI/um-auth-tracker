import { useMemo } from "react";
import type { Authorization, AuthType } from "../data/types";
import { fmtMoney, bandMidpoint, severityRank, severityTier } from "../lib/severity";
import { landingWithin, predictWindow, timelinePosition } from "../lib/predict";

const HORIZON_DAYS = 42; // six weeks
const WEEKS = 6;

/**
 * Concept C — the planning view. Every open authorization plotted by its
 * predicted claim-submission window, one lane per type. Node size encodes
 * severity; the faint band is the confidence range. Answers "when is the work
 * landing, and where does high-dollar volume cluster".
 */
export function Timeline({
  auths,
  onOpenCase,
}: {
  auths: Authorization[];
  onOpenCase: (type: AuthType, id: string) => void;
}) {
  const lanes = useMemo(() => buildLanes(auths), [auths]);
  const landing21 = landingWithin(auths, 21);
  const highDollar21 = auths.filter(
    (a) => predictWindow(a).median <= 21 && severityTier(a) !== "standard",
  ).length;

  return (
    <div className="timeline">
      <div className="timeline__head">
        <div className="sevkey">
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
        <div className="timeline__legend">
          Position = predicted claim date · size = severity · band = confidence range
        </div>
      </div>

      <div className="tlboard">
        <div className="tlscale">
          <div className="tlscale__type">Type</div>
          {Array.from({ length: WEEKS }, (_, i) => (
            <div className="tlscale__wk mono" key={i}>
              {i === 0 ? "This wk" : `+${i} wk`}
            </div>
          ))}
        </div>

        {lanes.map((lane) => (
          <div className="lane" key={lane.type}>
            <div className="lane__name">
              {lane.type}
              <small>
                {lane.list.length} open · {lane.highDollar} high-dollar
              </small>
            </div>
            <div className="lane__track">
              <div className="lane__grid" aria-hidden="true">
                {Array.from({ length: WEEKS }, (_, i) => (
                  <i key={i} />
                ))}
              </div>
              <div className="lane__now" aria-hidden="true" />
              {lane.list.map((auth, i) => (
                <Node
                  key={auth.id}
                  auth={auth}
                  labelBelow={i % 2 === 1}
                  onOpen={() => onOpenCase(auth.type, auth.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="timeline__foot">
        <div>
          <b>{highDollar21} high-dollar claims</b> predicted within 21 days · {landing21} claims
          total landing in the same window.
        </div>
        <button className="step">
          Open capacity plan for the next 3 weeks <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}

function Node({
  auth,
  labelBelow,
  onOpen,
}: {
  auth: Authorization;
  labelBelow: boolean;
  onOpen: () => void;
}) {
  const w = predictWindow(auth);
  const tier = severityTier(auth);
  const left = timelinePosition(w, HORIZON_DAYS) * 100;
  const bandW = ((w.high - w.low) / HORIZON_DAYS) * 100;
  const showLabel = tier !== "standard";
  return (
    <button
      className={`node node--${tier} ${labelBelow ? "node--below" : "node--above"}`}
      style={{ left: `${left}%` }}
      onClick={onOpen}
      title={`${auth.id} · ${auth.patientLabel} · predicted ${w.low}–${w.high} days`}
    >
      {tier !== "standard" && (
        <span className="node__band" style={{ width: `${bandW}%` }} aria-hidden="true" />
      )}
      <span className="node__dot" aria-hidden="true" />
      {showLabel && (
        <span className="node__lab mono">
          {shortName(auth.patientLabel)} · {fmtMoney(bandMidpoint(auth.estimatedEpisode))}
        </span>
      )}
    </button>
  );
}

interface Lane {
  type: AuthType;
  list: Authorization[];
  highDollar: number;
}

function buildLanes(auths: Authorization[]): Lane[] {
  const map = new Map<AuthType, Authorization[]>();
  for (const a of auths) {
    const arr = map.get(a.type) ?? [];
    arr.push(a);
    map.set(a.type, arr);
  }
  return [...map.entries()]
    .map(([type, list]) => ({
      type,
      list,
      highDollar: list.filter((a) => severityTier(a) !== "standard").length,
    }))
    // Lanes carrying the most severe case sit at the top.
    .sort((a, b) => severityRank(maxSeverity(b.list)) - severityRank(maxSeverity(a.list)));
}

function maxSeverity(list: Authorization[]): Authorization {
  return [...list].sort((x, y) => severityRank(y) - severityRank(x))[0]!;
}

function shortName(label: string): string {
  return label.split(" · ")[0] ?? label;
}
