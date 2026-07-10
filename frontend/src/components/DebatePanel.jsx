// frontend/src/components/DebatePanel.jsx
import { parseArgument } from '../utils/parseArgument';
import './DebatePanel.css';

function DebatePanel({ side, text, unverified = [] }) {
  const { thesis, factors, closingLabel, closingText } = parseArgument(text);
  const label = side === 'bull' ? 'The Bull Case' : 'The Bear Case';

  return (
    <div className={`debate-panel ${side}`}>
      <div className="debate-panel-header">
        <span className="debate-panel-tag">{side === 'bull' ? '▲' : '▼'}</span>
        {label}
        {unverified.length > 0 && (
          <span className="unverified-badge" title={unverified.join(', ')}>
            ⚠ {unverified.length} unverified
          </span>
        )}
      </div>

      <p className="debate-thesis">{thesis}</p>

      <ul className="debate-factors">
        {factors.map((factor, i) => (
          <li key={i}>{factor}</li>
        ))}
      </ul>

      {closingText && (
        <div className="debate-closing">
          <span className="debate-closing-label">{closingLabel}</span>
          <p>{closingText}</p>
        </div>
      )}
    </div>
  );
}

export default DebatePanel;