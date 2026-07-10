// frontend/src/components/GraphModal.jsx
import './GraphModal.css';

const NODES = [
  {
    label: 'Data Ingestion',
    name: 'RESEARCHER',
    desc: 'Tavily News + Yahoo Finance Metrics',
    accent: 'gold',
  },
];

function GraphModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <h2 className="modal-title">Multi-Agent System Architecture</h2>

        <div className="flowchart">
          {/* Node 1: Researcher */}
          <div className="flow-node gold">
            <div className="flow-node-name">RESEARCHER</div>
            <div className="flow-node-label">Data Ingestion</div>
            <div className="flow-node-desc">Tavily News + Yahoo Finance Metrics</div>
          </div>

          <div className="flow-arrow">
            <span className="arrow-line" />
            <span className="arrow-text">fan-out, parallel</span>
          </div>

          {/* Node 2 & 3: Bull & Bear, side by side */}
          <div className="flow-branch">
            <div className="flow-node bull">
              <div className="flow-node-name">BULL</div>
              <div className="flow-node-label">Adversarial Debate</div>
              <div className="flow-node-desc">Growth case, grounded in fetched data</div>
            </div>
            <div className="flow-node bear">
              <div className="flow-node-name">BEAR</div>
              <div className="flow-node-label">Adversarial Debate</div>
              <div className="flow-node-desc">Risk case, grounded in fetched data</div>
            </div>
          </div>

          <div className="flow-arrow">
            <span className="arrow-line" />
            <span className="arrow-text">fan-in, sync</span>
          </div>

          {/* Node 4: Judge */}
          <div className="flow-node gold">
            <div className="flow-node-name">JUDGE</div>
            <div className="flow-node-label">Final Verdict</div>
            <div className="flow-node-desc">Fact-checks claims, confidence scoring & decision synthesis</div>
          </div>
        </div>

        <p className="modal-footnote">
          Powered by LangGraph.js &amp; Llama 3.3 70B via Groq LPUs.
        </p>
      </div>
    </div>
  );
}

export default GraphModal;