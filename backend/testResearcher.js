// testResearcher.js — quick manual test, delete once things work
require('dotenv').config();

const { researcherNode } = require('./agent/nodes/researcher');
const { createInitialState } = require('./agent/state');

async function runTest() {
  const state = createInitialState('Tata Motors');

  console.log('--- Running Researcher Node ---');
  const result = await researcherNode(state);

  console.log('\n--- Research Brief (LLM-generated) ---');
  console.log(result.companyData.researchBrief);

  console.log('\n--- Raw Financials (for reference) ---');
  console.log(result.companyData.financials);
}

runTest().catch((err) => {
  console.error('Test failed:', err);
});