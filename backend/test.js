// test.js — quick manual test, delete this once things work
require('dotenv').config();

const { getFinancialData, findTicker } = require('./services/yahooFinance');
const { getRecentNews } = require('./services/tavily');

async function runTest() {
  const companyName = 'Tata Motors';

  console.log(`\n--- Testing ticker lookup for "${companyName}" ---`);
  const ticker = await findTicker(companyName);
  console.log('Ticker found:', ticker);

  if (ticker) {
    console.log(`\n--- Testing financial data for "${ticker}" ---`);
    const financials = await getFinancialData(ticker);
    console.log(financials);
  }

  console.log(`\n--- Testing news fetch for "${companyName}" ---`);
  const news = await getRecentNews(companyName);
  console.log(news);
}

runTest();