// agent/state.js

// In multi-agent systems, "state" is a shared, centralized object that gets passed from one agent (or node) to the next. Each agent reads from this state, does its specific job, and updates the state before passing it along.
function createInitialState(companyName) {
  return {
    companyName,
    companyData: {
      financials: null,   // filled in by researcher.js
      news: [],            // filled in by researcher.js
    },
    bullCase: null,        // filled in by bullAgent.js
    bearCase: null,         // filled in by bearAgent.js
    verdict: null,          // filled in by judge.js
  };
}

module.exports = { createInitialState };