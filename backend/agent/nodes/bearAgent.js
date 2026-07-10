// agent/nodes/bearAgent.js
const { ChatGroq } = require('@langchain/groq');

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama-3.3-70b-versatile',
  temperature: 0.4,
});

async function bearAgentNode(state) {
  const { companyName, companyData } = state;

  const prompt = `
You are a skeptical equity analyst. Your job is to build the STRONGEST possible case for why 
someone should PASS on investing in "${companyName}", based only on the research below. Be 
critical but honest — don't invent risks not supported by the data.

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
1. THESIS: One sentence — your core argument against investing
2. KEY RISKS: 3-4 bullet points, each citing a specific fact from the research
3. BIGGEST CONCERN: Which single risk matters most, and why
`;

  const response = await model.invoke(prompt);

  return {
    bearCase: response.content,
  };
}

module.exports = { bearAgentNode };