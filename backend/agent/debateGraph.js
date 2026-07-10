// agent/debateGraph.js
const { StateGraph, START, END, Annotation } = require('@langchain/langgraph');
const { bullAgentNode } = require('./nodes/bullAgent');
const { bearAgentNode } = require('./nodes/bearAgent');
const { judgeNode } = require('./nodes/judge');

const DebateStateAnnotation = Annotation.Root({
  companyName: Annotation(),
  companyData: Annotation(),
  bullCase: Annotation(),
  bearCase: Annotation(),
  verdict: Annotation(),
});

function buildDebateGraph() {
  const graph = new StateGraph(DebateStateAnnotation)
    .addNode('bullAgent', bullAgentNode)
    .addNode('bearAgent', bearAgentNode)
    .addNode('judge', judgeNode)
    .addEdge(START, 'bullAgent')
    .addEdge(START, 'bearAgent')
    .addEdge('bullAgent', 'judge')
    .addEdge('bearAgent', 'judge')
    .addEdge('judge', END);

  return graph.compile();
}

module.exports = { buildDebateGraph };