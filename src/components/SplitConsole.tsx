import { useMemo } from "react";
import type { Authorization, AuthType } from "../data/types";
import { fmtBand, severityRank, severityTier } from "../lib/severity";
import { fmtWindow, predictWindow } from "../lib/predict";
import { DualSeverity } from "./DualSeverity";

const TYPE_ORDER: AuthType[] = [
  "Transplant",
  "Oncology",
  "NICU",
  "Behavioral Health",
  "Cardiology",
  "Orthopedics",
];

/**
 * Concept B — the working screen. Pick a type on the left; the right becomes a
 * single-case worksheet showing the severity signals, the similar historical
 * authorizations that back the prediction, and the resulting claim window.
 */
export function SplitConsole({
  auths,
  selectedType,
  onSelectType,
}: {
  auths: Authorization[];
  selectedType: AuthType;
  onSelectType: (t: AuthType) => void;
}) {
  const byType = useMemo(() => groupByType(auths), [auths]);
  const inType = byType.get(selectedType) ?? [];
  const focus = inType[0]; // most-severe open case in the group

  return (
    <div className="console">
      <nav className="console__nav" aria-label="Authorization types">
        <div className="console__navhead">Authorization type</div>
        {TYPE_ORDER.filter((t) => byType.has(t)).map((type) => {
          const list = byType.get(type)!;
          return (
            <button
              key={type}
              className="navitem"
              aria-current={type === selectedType}
              onClick={() => onSelectType(type)}
            >
              <span className="navitem__top">
                <span>{type}</span>
                <span className="mono navitem__count">{list.length}</span>
              </span>
              <MiniMix list={list} />
            </button>
          );
        })}
      </nav>

      <div className="console__detail">
        {focus ? <CaseWorksheet auth={focus} count={inType.length} /> : <Empty />}
      </div>
    </div>
  );
}

function CaseWorksheet({ auth, count }: { auth: Authorization; count: number }) {
  const window = predictWindow(auth);
  return (
    <>
      <header className="worksheet__head">
        <div>
          <h3>{auth.type}</h3>
          <div className="worksheet__sub">
            {count} open · showing the highest-severity case in this group
          </div>
        </div>
        <DualSeverity auth={auth} />
      </header>

      <div className="worksheet__focus">
        <span className="tag">Focus case</span>
        <div className="worksheet__case">
          <span className="mono worksheet__caseid">{auth.id}</span> {auth.patientLabel}
        </div>
        <p className="worksheet__clin">
          {auth.clinicalSummary} Estimated episode <b>{fmtBand(auth.estimatedEpisode)}</b>.{" "}
          Model drivers: {auth.drivers.join(", ")}.
        </p>
      </div>

      <div className="worksheet__grid">
        <section className="block">
          <div className="block__head">
            <span>Similar past authorizations</span>
            <span>Auth → claim gap</span>
          </div>
          <div className="simlist">
            {auth.similar.map((s) => (
              <div className="simrow" key={s.id}>
                <div>
                  <div className="mono simrow__id">{s.id}</div>
                  <div className="simrow__meta">{s.label}</div>
                </div>
                <div className="simrow__right">
                  <div className="mono simrow__gap">{s.gapDays} days</div>
                  <div className="simrow__match">{Math.round(s.match * 100)}% match</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="block">
          <div className="block__head">
            <span>Predicted claim submission</span>
            <span>Open auth</span>
          </div>
          <div className="predbox">
            <div className="predbox__win mono">{fmtWindow(window)}</div>
            <div className="predbox__sub">
              median {window.median} days · from {auth.similar.length} similar authorizations
            </div>
            <WindowRange low={window.low} high={window.high} />
          </div>
        </section>
      </div>

      <div className="nextbar">
        <div className="nextbar__text">
          <b>Next step:</b> {auth.nextStep}
        </div>
        <button className="btn">
          {auth.nextStepCta} <span className="arrow">→</span>
        </button>
      </div>
    </>
  );
}

/** A 0–42 day horizon bar with the predicted window marked. */
function WindowRange({ low, high }: { low: number; high: number }) {
  const H = 42;
  const l = Math.min(100, (low / H) * 100);
  const r = Math.min(100, (high / H) * 100);
  return (
    <>
      <div className="range" aria-hidden="true">
        <i style={{ left: `${l}%`, right: `${100 - r}%` }} />
      </div>
      <div className="range__ticks mono">
        <span>Now</span>
        <span>+2 wk</span>
        <span>+4 wk</span>
        <span>+6 wk</span>
      </div>
    </>
  );
}

function MiniMix({ list }: { list: Authorization[] }) {
  const c = { critical: 0, elevated: 0, standard: 0 };
  list.forEach((a) => (c[severityTier(a)] += 1));
  const total = list.length || 1;
  return (
    <span className="minimix" aria-hidden="true">
      <i style={{ width: `${(c.critical / total) * 100}%`, background: "var(--sev-crit)" }} />
      <i style={{ width: `${(c.elevated / total) * 100}%`, background: "var(--sev-elev)" }} />
      <i style={{ width: `${(c.standard / total) * 100}%`, background: "var(--sev-std)" }} />
    </span>
  );
}

function Empty() {
  return <div className="worksheet__sub">No open authorizations in this group.</div>;
}

function groupByType(auths: Authorization[]): Map<AuthType, Authorization[]> {
  const map = new Map<AuthType, Authorization[]>();
  for (const a of auths) {
    const arr = map.get(a.type) ?? [];
    arr.push(a);
    map.set(a.type, arr);
  }
  for (const list of map.values()) list.sort((x, y) => severityRank(y) - severityRank(x));
  return map;
}
