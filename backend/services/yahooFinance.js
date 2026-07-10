// services/yahooFinance.js
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function findTicker(companyName) {
  try {
    const results = await yahooFinance.search(companyName);
    const quotes = (results.quotes || []).filter(
      (q) => q.quoteType === 'EQUITY' && q.isYahooFinance
    );

    if (quotes.length === 0) return null;

    // Trust Yahoo's own relevance score — it already ranked these
    quotes.sort((a, b) => (b.score || 0) - (a.score || 0));
    const topMatch = quotes[0];

    // Only switch to an NSE listing if it's the SAME company (exact longname match),
    // not just a symbol that happens to end in .NS
    const sameCompanyOnNSE = quotes.find(
      (q) => q.symbol.endsWith('.NS') && q.longname === topMatch.longname
    );

    return sameCompanyOnNSE ? sameCompanyOnNSE.symbol : topMatch.symbol;
  } catch (err) {
    console.error(`Ticker lookup failed for ${companyName}:`, err.message);
    return null;
  }
}

async function getFinancialData(ticker) {
  try {
    const quote = await yahooFinance.quote(ticker);
    const summary = await yahooFinance.quoteSummary(ticker, {
      modules: ['financialData', 'defaultKeyStatistics'],
    });

    return {
      ticker,
      currency: quote.currency || 'USD', // NEW — capture the real currency
      currentPrice: quote.regularMarketPrice,
      priceChange: quote.regularMarketChangePercent,
      peRatio: quote.trailingPE || null,
      revenueGrowth: summary.financialData?.revenueGrowth || null,
      debtToEquity: summary.financialData?.debtToEquity || null,
      profitMargin: summary.financialData?.profitMargins || null,
      marketCap: quote.marketCap,
    };
  } catch (err) {
    console.error(`Failed to fetch financial data for ${ticker}:`, err.message);
    return null;
  }
}

module.exports = { getFinancialData, findTicker };