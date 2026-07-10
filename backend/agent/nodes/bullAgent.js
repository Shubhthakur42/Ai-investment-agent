// agent/nodes/bullAgent.js
const { ChatGroq } = require('@langchain/groq');

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama-3.3-70b-versatile',
  temperature: 0.4, // persuasive but constrained to real data
});

async function bullAgentNode(state) {
  const { companyName, companyData } = state;

  const prompt = `
You are a bullish equity analyst. Your job is to build the STRONGEST possible case for why 
someone should INVEST in "${companyName}", based only on the research below. Be persuasive but 
honest — don't invent facts not in the data.

RESEARCH BRIEF:
You have no other knowledge about this specific company beyond what is written above. 
Even if you recognize this company and recall other facts about it, you must ignore that 
knowledge completely — it is not verified for this analysis and must not appear in your response.
${companyData.researchBrief}

IMPORTANT: Only use numbers and facts that appear explicitly in the research brief above. 
Do not introduce any financial metric, statistic, or figure that is not stated in the brief, 
even if it seems plausible. If you don't have enough data to support a point, say so rather 
than inventing a number.

Structure your response as:
1. THESIS: One sentence — your core argument for investing
2. KEY FACTORS: 3-4 bullet points, each citing a specific fact from the research
3. STRONGEST POINT: Which single factor matters most, and why
`;

  const response = await model.invoke(prompt);

  return {
    bullCase: response.content,
  };
}

module.exports = { bullAgentNode };