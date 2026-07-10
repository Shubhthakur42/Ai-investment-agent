// frontend/src/components/CompanyInput.jsx
import './CompanyInput.css';

const EXAMPLES = ['Infosys', 'Tata Motors', 'Reliance Industries'];

function CompanyInput({ value, onChange, onSubmit, disabled }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSubmit();
  };

  return (
    <div className="company-input">
      <div className="company-input-row">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a company name"
          disabled={disabled}
        />
        <button onClick={onSubmit} disabled={disabled || !value.trim()}>
          {disabled ? 'Analyzing…' : 'Analyze'}
        </button>
      </div>
      <div className="company-input-examples">
        <span>Try:</span>
        {EXAMPLES.map((name) => (
          <button
            key={name}
            className="example-chip"
            onClick={() => onChange(name)}
            disabled={disabled}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CompanyInput;