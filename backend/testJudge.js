// testJudge.js — quick manual test, delete once things work
require('dotenv').config();

const { researcherNode } = require('./agent/nodes/researcher');
const { bullAgentNode } = require('./agent/nodes/bullAgent');
const { bearAgentNode } = require('./agent/nodes/bearAgent');
const { judgeNode } = require('./agent/nodes/judge');
const { createInitialState } = require('./agent/state');

async function runTest() {
  let state = createInitialState('Tata Motors');

  console.log('--- Step 1: Researcher ---');
  state = { ...state, ...(await researcherNode(state)) };

  console.log('--- Step 2: Bull ---');
  state = { ...state, ...(await bullAgentNode(state)) };

  console.log('--- Step 3: Bear ---');
  state = { ...state, ...(await bearAgentNode(state)) };

  console.log('--- Step 4: Judge ---');
  state = { ...state, ...(await judgeNode(state)) };

  console.log('\n=== FINAL VERDICT ===');
  console.log(state.verdict);
}

runTest().catch((err) => {
  console.error('Test failed:', err);
});