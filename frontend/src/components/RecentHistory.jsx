// frontend/src/components/RecentHistory.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import './RecentHistory.css';

function RecentHistory({ refreshKey }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/history`)
      .then((res) => setHistory(res.data))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading || history.length === 0) return null;

  return (
    <div className="recent-history">
      <div className="recent-history-title">Recent Analyses</div>
      <div className="recent-history-list">
        {history.slice(0, 8).map((item) => (
          <div key={item.id} className="history-row">
            <span className="history-company">{item.company_name}</span>
            <span className={`history-decision ${item.decision === 'INVEST' ? 'invest' : 'pass'}`}>
              {item.decision}
            </span>
            <span className="history-confidence">{item.avg_confidence}%</span>
            <span className="history-consistency">{item.consistency}% consistent</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentHistory;