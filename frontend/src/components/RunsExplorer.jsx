// frontend/src/components/RunsExplorer.jsx
import { useState } from 'react';
import DebatePanel from './DebatePanel';
import './RunsExplorer.css';

function RunsExplorer({ runs }) {
  const [expanded, setExpanded] = useState(false);
  const [activeRun, setActiveRun] = useState(0);

  if (!runs || runs.length === 0) return null;

  const current = runs[activeRun];

  return (
    <div className="runs-explorer">
      <button className="runs-toggle" onClick={() => setExpanded((e) => !e)}>
        {expanded ? '▾' : '▸'} View all {runs.length} independent runs
      </button>

      {expanded && (
        <div className="runs-content">
          <div className="runs-tabs">
            {runs.map((run, i) => (
              <button
                key={i}
                className={`run-tab ${activeRun === i ? 'active' : ''} ${run.verdict.decision === 'INVEST' ? 'invest' : 'pass'}`}
                onClick={() => setActiveRun(i)}
              >
                Run {i + 1}: {run.verdict.decision} ({run.verdict.confidence}%)
              </button>
            ))}
          </div>

          <div className="debate-row">
            <DebatePanel side="bull" text={current.bullCase} unverified={current.verdict.bullUnverified} />
            <DebatePanel side="bear" text={current.bearCase} unverified={current.verdict.bearUnverified} />
          </div>
        </div>
      )}
    </div>
  );
}

export default RunsExplorer;