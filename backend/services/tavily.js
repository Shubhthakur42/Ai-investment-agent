// services/tavily.js
const axios = require('axios');

async function getRecentNews(companyName) {
  try {
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: process.env.TAVILY_API_KEY,
      query: `${companyName} recent news financial performance`,
      search_depth: 'basic',
      max_results: 3,
    });

    return response.data.results.map((item) => ({
      title: item.title,
      snippet: item.content,
      url: item.url,
    }));
  } catch (err) {
    console.error(`News fetch failed for ${companyName}:`, err.message);
    return [];
  }
}

module.exports = { getRecentNews };