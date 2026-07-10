// frontend/src/App.jsx
import { useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import CompanyInput from './components/CompanyInput';
import LoadingSteps from './components/LoadingSteps';
import VerdictStamp from './components/VerdictStamp';
import RunsExplorer from './components/RunsExplorer';
import HowItWorks from './components/HowItWorks';
import './App.css';

function App() {
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!companyName.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/analyze`, {
      companyName: companyName.trim(),
});
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="app-shell">
        <header className="app-header">
          <div className="eyebrow">Bull · Bear · Judge — 3 independent runs</div>
          <h1>AI Investment Research Agent</h1>
          <p>Enter a company. Three AI analysts debate it, three times. You get the verdict.</p>
        </header>

        <CompanyInput
          value={companyName}
          onChange={setCompanyName}
          onSubmit={handleAnalyze}
          disabled={loading}
        />

        {loading && <LoadingSteps />}

        {error && <p className="app-error">{error}</p>}

        {!loading && !result && !error && <HowItWorks />}

        {result && (
          <div className="results">
            <VerdictStamp aggregate={result.aggregate} />
            <RunsExplorer runs={result.runs} />
          </div>
        )}
      </div>
    </>
  );
}

export default App;