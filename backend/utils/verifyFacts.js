// utils/verifyFacts.js

// Extracts numeric claims (percentages, currency figures) from text
function extractNumbers(text) {
  const matches = text.match(/[\d,]+\.?\d*%|₹[\d,]+\.?\d*|\$[\d,]+\.?\d*\s?(billion|crore|million)?/gi) || [];
  return matches.map((m) => m.replace(/,/g, '').trim());
}

// Checks which numeric claims in the argument do NOT appear in the source brief
function findUnverifiedClaims(argumentText, sourceBrief) {
  const claimedNumbers = extractNumbers(argumentText);
  const sourceNumbers = new Set(extractNumbers(sourceBrief));

  const unverified = claimedNumbers.filter((num) => !sourceNumbers.has(num));
  return [...new Set(unverified)]; // dedupe
}

module.exports = { findUnverifiedClaims };