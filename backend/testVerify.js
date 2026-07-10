// testVerify.js — quick isolated test of the fact-checker logic
const { findUnverifiedClaims } = require('./utils/verifyFacts');

const sourceBrief = `
FINANCIAL FACTS (exact, verified data):
- Current stock price: ₹10.92
- Revenue growth: 6.6%
- Profit margin: 16.43%

RECENT NEWS SUMMARY:
Infosys reported quarterly revenue of $5.04 billion with free cash flow of $1.1 billion.
`;

const fakeArgument = `
The company's operating margin of 21.1% and free cash flow growth of 25.2% year-on-year 
are strong indicators, along with total expenses of ₹36,659.00 crore.
`;

const result = findUnverifiedClaims(fakeArgument, sourceBrief);
console.log('Unverified claims found:', result);