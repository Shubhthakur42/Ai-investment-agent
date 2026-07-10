// agent/graph.js
const { StateGraph, START, END, Annotation } = require('@langchain/langgraph');
const { researcherNode } = require('./nodes/researcher');
const { bullAgentNode } = require('./nodes/bullAgent');
const { bearAgentNode } = require('./nodes/bearAgent');
const { judgeNode } = require('./nodes/judge');

// Define the shape of state LangGraph will manage.
// Each key needs a "reducer" — how to merge updates from nodes into the state.
// Default (overwrite) is fine for all our fields since each node owns its own field.
const AgentStateAnnotation = Annotation.Root({
  companyName: Annotation(),
  companyData: Annotation(),
  bullCase: Annotation(),
  bearCase: Annotation(),
  verdict: Annotation(),
});

function buildGraph() {
  const graph = new StateGraph(AgentStateAnnotation)
    .addNode('researcher', researcherNode)
    .addNode('bullAgent', bullAgentNode)
    .addNode('bearAgent', bearAgentNode)
    .addNode('judge', judgeNode)

    // researcher runs first
    .addEdge(START, 'researcher')

    // from researcher, branch into BOTH bull and bear — this is what makes them parallel
    .addEdge('researcher', 'bullAgent')
    .addEdge('researcher', 'bearAgent')

    // judge waits until BOTH bull and bear have finished
    .addEdge('bullAgent', 'judge')
    .addEdge('bearAgent', 'judge')

    .addEdge('judge', END);

  return graph.compile();
}

module.exports = { buildGraph };