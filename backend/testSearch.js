// testSearch.js — see exactly what Yahoo Finance search returns for "Infosys"
require('dotenv').config();
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function run() {
  const results = await yahooFinance.search('Infosys');
  console.log(JSON.stringify(results.quotes, null, 2));
}

run();