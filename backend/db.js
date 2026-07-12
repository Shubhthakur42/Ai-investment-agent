// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 5,
});

async function saveAnalysis({ companyName, decision, avgConfidence, consistency }) {
  try {
    await pool.query(
      'INSERT INTO analysis_history (company_name, decision, avg_confidence, consistency) VALUES (?, ?, ?, ?)',
      [companyName, decision, avgConfidence, consistency]
    );
  } catch (err) {
    // Don't let a DB failure break the actual analysis response
    console.error('Failed to save analysis history:', err.message);
  }
}

async function getHistory() {
  const [rows] = await pool.query(
    'SELECT id, company_name, decision, avg_confidence, consistency, created_at FROM analysis_history ORDER BY created_at DESC LIMIT 20'
  );
  return rows;
}

module.exports = { saveAnalysis, getHistory };