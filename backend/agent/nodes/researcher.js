// agent/nodes/researcher.js
const { ChatGroq } = require('@langchain/groq');
const { findTicker, getFinancialData } = require('../../services/yahooFinance');
//  Ticker: Every asset on a specific exchange is assigned a distinct code so it doesn't get confused with other companies (e.g., Apple is AAPL, Microsoft is MSFT, Bitcoin is BTC). findTicker: asynchronous function Converts a company name (e.g., "Apple") into a stock ticker (e.g., "AAPL").
// getFinancialData:: developer-defined function in the yahooFinance module used to pull fundamental, balance sheet, and income statement metrics for a specific company or asset.
const { getRecentNews } = require('../../services/tavily');
// getRecentNews: Searches the web for current articles using Tavily (an AI-focused search API).

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama-3.3-70b-versatile',
  temperature: 0.3,
});

function formatFinancialsAsFacts(financials) {
  if (!financials) return 'No financial data available.';

  const symbol = financials.currency === 'INR' ? '₹' : financials.currency === 'USD' ? '$' : financials.currency + ' ';

  return `
- Current stock price: ${symbol}${financials.currentPrice ?? 'N/A'}
- Price change: ${financials.priceChange?.toFixed(2) ?? 'N/A'}%
- P/E ratio: ${financials.peRatio?.toFixed(2) ?? 'N/A'}
- Revenue growth: ${financials.revenueGrowth != null ? (financials.revenueGrowth * 100).toFixed(1) + '%' : 'N/A'}
- Debt-to-equity ratio: ${financials.debtToEquity?.toFixed(2) ?? 'N/A'}
- Profit margin: ${financials.profitMargin != null ? (financials.profitMargin * 100).toFixed(2) + '%' : 'N/A'}
- Market cap: ${symbol}${financials.marketCap?.toLocaleString() ?? 'N/A'}
`.trim();
}

async function researcherNode(state) {
  const { companyName } = state;

  const ticker = await findTicker(companyName);
  const financials = ticker ? await getFinancialData(ticker) : null;
  const news = await getRecentNews(companyName);

  // Only summarize the NEWS with the LLM — financials stay as exact, untouched numbers
  const newsPrompt = `
Summarize these news snippets about "${companyName}" into 2-3 factual sentences. 
Only use information present in the snippets below — do not add outside knowledge.

${news.length > 0 ? news.map((n, i) => `${i + 1}. ${n.title} — ${n.snippet}`).join('\n') : 'No recent news found.'}
`;

  const newsSummaryResponse = await model.invoke(newsPrompt);

  const financialFacts = formatFinancialsAsFacts(financials);
  const researchBrief = `FINANCIAL FACTS (exact, verified data):\n${financialFacts}\n\nRECENT NEWS SUMMARY:\n${newsSummaryResponse.content}`;

  return {
    companyData: {
      financials,
      news,
      researchBrief,
    },
  };
}

module.exports = { researcherNode };