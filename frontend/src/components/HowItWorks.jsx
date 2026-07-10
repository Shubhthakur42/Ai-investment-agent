// frontend/src/components/HowItWorks.jsx
import './HowItWorks.css';

const STEPS = [
  {
    icon: '▲',
    accent: 'bull',
    title: 'Bull Agent',
    desc: 'Builds the strongest possible case for investing, grounded only in real fetched data.',
  },
  {
    icon: '▼',
    accent: 'bear',
    title: 'Bear Agent',
    desc: 'Builds the strongest possible case against investing, using the same evidence.',
  },
  {
    icon: '⚖',
    accent: 'gold',
    title: 'Judge Agent',
    desc: 'Weighs both arguments, fact-checks their claims, and delivers a verdict with confidence.',
  },
];

function HowItWorks() {
  return (
    <div className="how-it-works">
      {STEPS.map((step) => (
        <div key={step.title} className={`how-card ${step.accent}`}>
          <div className="how-icon">{step.icon}</div>
          <div className="how-title">{step.title}</div>
          <p className="how-desc">{step.desc}</p>
        </div>
      ))}
      <div className="how-footnote">
        Runs 3× independently on the same data — the debate isn't final until all three agree, or don't.
      </div>
    </div>
  );
}

export default HowItWorks;