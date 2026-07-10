// utils/aggregateVerdicts.js

function aggregateVerdicts(verdicts) {
  const counts = { INVEST: 0, PASS: 0 };
  verdicts.forEach((v) => {
    counts[v.decision] = (counts[v.decision] || 0) + 1;
  });

  const majorityDecision = counts.INVEST >= counts.PASS ? 'INVEST' : 'PASS';
  const agreementCount = counts[majorityDecision];
  const consistency = Math.round((agreementCount / verdicts.length) * 100);
  const avgConfidence = Math.round(
    verdicts.reduce((sum, v) => sum + v.confidence, 0) / verdicts.length
  );

  return {
    majorityDecision,
    agreementCount,
    totalRuns: verdicts.length,
    consistency, // e.g. 100 = all 3 runs agreed, 67 = 2 of 3 agreed
    avgConfidence,
  };
}

module.exports = { aggregateVerdicts };