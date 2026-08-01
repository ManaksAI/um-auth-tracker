import { useState } from "react";
import type { AuthType } from "./data/types";
import { AUTHORIZATIONS } from "./data/mock";
import { severityTier } from "./lib/severity";
import { landingWithin } from "./lib/predict";
import { PriorityFeed } from "./components/PriorityFeed";
import { SplitConsole } from "./components/SplitConsole";
import { Timeline } from "./components/Timeline";
import "./styles/components.css";

type View = "queue" | "case" | "timeline";

const VIEWS: Array<{ id: View; k: string; t: string }> = [
  { id: "queue", k: "Landing", t: "Priority Queue" },
  { id: "case", k: "Working screen", t: "Case Console" },
  { id: "timeline", k: "Planning", t: "Claim Timeline" },
];

const HINTS: Record<View, string> = {
  queue:
    "The daily queue — open authorizations grouped by type, most-severe first. Start at the top; open any case to work it in the console.",
  case:
    "The working screen. Pick a type; the right side shows the severity signals, the similar historical authorizations behind the prediction, and the claim window.",
  timeline:
    "The planning view. Every open authorization plotted by predicted claim date, lanes by type — see when high-dollar volume lands and staff for it.",
};

export default function App() {
  const [view, setView] = useState<View>("queue");
  const [selectedType, setSelectedType] = useState<AuthType>("Transplant");

  const auths = AUTHORIZATIONS;
  const critical = auths.filter((a) => severityTier(a) === "critical").length;
  const highDollar = auths.filter((a) => severityTier(a) !== "standard").length;
  const thisWeek = landingWithin(auths, 7);

  function openCase(type: AuthType) {
    setSelectedType(type);
    setView("case");
  }

  return (
    <div className="shell">
      <header className="masthead">
        <div>
          <p className="kicker">Utilization Management · Authorization Tracking</p>
          <h1>Prior-auth triage, episode risk, and claim timing</h1>
        </div>
        <div className="stats">
          <div className="stat">
            <div className="n">{auths.length}</div>
            <div className="l">Open auths</div>
          </div>
          <div className="stat">
            <div className="n">{highDollar}</div>
            <div className="l">High-dollar</div>
          </div>
          <div className="stat">
            <div className="n">{critical}</div>
            <div className="l">Critical</div>
          </div>
          <div className="stat">
            <div className="n">{thisWeek}</div>
            <div className="l">Claims this wk</div>
          </div>
        </div>
      </header>

      <nav className="tabnav" role="tablist" aria-label="Views">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={view === v.id}
            onClick={() => setView(v.id)}
          >
            <span className="k">{v.k}</span>
            <span className="t">{v.t}</span>
          </button>
        ))}
      </nav>

      <p className="hint">
        <span className="num">{view === "queue" ? "1" : view === "case" ? "2" : "3"}</span>
        <span>{HINTS[view]}</span>
      </p>

      {view === "queue" && <PriorityFeed auths={auths} onOpenCase={openCase} />}
      {view === "case" && (
        <SplitConsole auths={auths} selectedType={selectedType} onSelectType={setSelectedType} />
      )}
      {view === "timeline" && <Timeline auths={auths} onOpenCase={openCase} />}

      <footer className="foot">
        <span>Monochromatic · severity encoded by tone and weight, not color · sample data</span>
        <span>{highDollar} of {auths.length} open authorizations need review</span>
      </footer>
    </div>
  );
}
