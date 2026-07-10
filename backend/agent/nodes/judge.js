// agent/nodes/judge.js
const { ChatGroq } = require('@langchain/groq');
const { findUnverifiedClaims } = require('../../utils/verifyFacts');

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama-3.3-70b-versatile',
  temperature: 0.2,
});

async function judgeNode(state) {
  const { companyName, bullCase, bearCase, companyData } = state;

  const bullUnverified = findUnverifiedClaims(bullCase, companyData.researchBrief);
  const bearUnverified = findUnverifiedClaims(bearCase, companyData.researchBrief);

  const verificationNote = `
FACT-CHECK RESULTS:
Bull case unverified figures (not present in original research data): ${bullUnverified.length ? bullUnverified.join(', ') : 'none — fully grounded'}
Bear case unverified figures (not present in original research data): ${bearUnverified.length ? bearUnverified.join(', ') : 'none — fully grounded'}

If a side cites unverified figures, treat that as a credibility weakness — reduce your confidence 
in that side's argument accordingly, and mention this in your reasoning.
`;

  const prompt = `
You are a senior investment committee judge. You have heard both sides of a debate about 
whether to invest in "${companyName}". Weigh both arguments fairly and make a final decision.

BULL CASE (for investing):
${bullCase}

BEAR CASE (against investing):
${bearCase}

${verificationNote}

Respond in EXACTLY this format (no extra text before or after):

DECISION: [INVEST or PASS]
CONFIDENCE: [a number from 0 to 100]
REASONING: [2-3 sentences explaining which side's argument was stronger and why, and note if either side used unverified figures]
KEY_FACTORS: [2-3 short factors separated by the "|" character]
`;

  const response = await model.invoke(prompt);
  const text = response.content;

  const decision = text.match(/DECISION:\s*(INVEST|PASS)/i)?.[1]?.toUpperCase() || 'UNKNOWN';
  const confidence = parseInt(text.match(/CONFIDENCE:\s*(\d+)/)?.[1] || '50', 10);
  const reasoning = text.match(/REASONING:\s*(.+?)(?=KEY_FACTORS:|$)/s)?.[1]?.trim() || '';
  const keyFactors = text.match(/KEY_FACTORS:\s*(.+)/s)?.[1]?.trim().split('|').map(f => f.trim()) || [];

  return {
    verdict: {
      decision,
      confidence,
      reasoning,
      keyFactors,
      bullUnverified,
      bearUnverified,
    },
  };
}

module.exports = { judgeNode };