// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { researcherNode } = require('./agent/nodes/researcher');
const { buildDebateGraph } = require('./agent/debateGraph');
const { aggregateVerdicts } = require('./utils/aggregateVerdicts');

const app = express();
app.use(cors());
app.use(express.json());

const debateGraph = buildDebateGraph();
const NUM_RUNS = 3;

app.post('/api/analyze', async (req, res) => {
  const { companyName } = req.body;

  if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
    return res.status(400).json({ error: 'companyName is required' });
  }

  try {
    // Step 1: research ONCE
    const researched = await researcherNode({ companyName: companyName.trim() });
    const baseState = { companyName: companyName.trim(), ...researched };

    // Step 2: run the debate 3 times in PARALLEL, all using the same research
    const runs = await Promise.all(
      Array.from({ length: NUM_RUNS }, () => debateGraph.invoke(baseState))
    );

    const verdicts = runs.map((r) => r.verdict);
    const aggregate = aggregateVerdicts(verdicts);

    res.json({
      companyName: companyName.trim(),
      companyData: researched.companyData,
      runs: runs.map((r) => ({ bullCase: r.bullCase, bearCase: r.bearCase, verdict: r.verdict })),
      aggregate,
    });
  } catch (err) {
    console.error('Analysis failed:', err);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});