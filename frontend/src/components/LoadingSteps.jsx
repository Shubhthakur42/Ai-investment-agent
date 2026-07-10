// frontend/src/components/LoadingSteps.jsx
import { useEffect, useState } from 'react';
import './LoadingSteps.css';

const STEPS = [
  'Researching company data…',
  'Building the bull case…',
  'Building the bear case…',
  'Weighing the verdict…',
];

function LoadingSteps() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => (i < STEPS.length - 1 ? i + 1 : i));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-steps">
      {STEPS.map((step, i) => (
        <div
          key={step}
          className={`loading-step ${i < stepIndex ? 'done' : ''} ${i === stepIndex ? 'active' : ''}`}
        >
          <span className="dot" />
          {step}
        </div>
      ))}
    </div>
  );
}

export default LoadingSteps;