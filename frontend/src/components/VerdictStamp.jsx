// frontend/src/components/VerdictStamp.jsx
import './VerdictStamp.css';

function VerdictStamp({ aggregate }) {
  if (!aggregate) return null;
  const { majorityDecision, agreementCount, totalRuns, consistency, avgConfidence } = aggregate;
  const isInvest = majorityDecision === 'INVEST';

  return (
    <div className="verdict-block">
      <div className={`verdict-stamp ${isInvest ? 'invest' : 'pass'}`}>
        <span className="verdict-decision">{majorityDecision}</span>
        <span className="verdict-confidence">{avgConfidence}% avg. confidence</span>
      </div>

      <div className="verdict-consistency">
        <span className="consistency-value">{consistency}%</span> consistency
        <span className="consistency-detail">
          — agreed on {agreementCount} of {totalRuns} independent runs
        </span>
      </div>
    </div>
  );
}

export default VerdictStamp;