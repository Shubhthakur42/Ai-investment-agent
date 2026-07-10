// testGraph.js — quick manual test, delete once things work
require('dotenv').config();

const { buildGraph } = require('./agent/graph');

async function runTest() {
  const app = buildGraph();

  console.log('--- Running full graph for "Tata Motors" ---');
  const startTime = Date.now();

  const result = await app.invoke({ companyName: 'Tata Motors' });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n--- Completed in ${elapsed}s ---`);

  console.log('\n=== FINAL VERDICT ===');
  console.log(result.verdict);
}

runTest().catch((err) => {
  console.error('Test failed:', err);
});