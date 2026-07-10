// testDebate.js — quick manual test, delete once things work
require('dotenv').config();

const { researcherNode } = require('./agent/nodes/researcher');
const { bullAgentNode } = require('./agent/nodes/bullAgent');
const { bearAgentNode } = require('./agent/nodes/bearAgent');
const { createInitialState } = require('./agent/state');

async function runTest() {
  let state = createInitialState('Tata Motors');

  console.log('--- Step 1: Researcher ---');
  const researchResult = await researcherNode(state);
  state = { ...state, ...researchResult };

  console.log('--- Step 2: Bull and Bear (running one after another for this test) ---');
  const bullResult = await bullAgentNode(state);
  const bearResult = await bearAgentNode(state);

  console.log('\n=== BULL CASE ===');
  console.log(bullResult.bullCase);

  console.log('\n=== BEAR CASE ===');
  console.log(bearResult.bearCase);
}

runTest().catch((err) => {
  console.error('Test failed:', err);
});