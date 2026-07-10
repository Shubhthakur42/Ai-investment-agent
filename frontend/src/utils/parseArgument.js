// frontend/src/utils/parseArgument.js

// Splits the LLM's "1. THESIS ... 2. KEY FACTORS ... 3. STRONGEST POINT ..." text
// into structured pieces for rendering.
export function parseArgument(text) {
  if (!text) return { thesis: '', factors: [], closingLabel: '', closingText: '' };

  const parts = text.split(/\n?\d\.\s+/).filter(Boolean);

  const thesis = parts[0]?.replace(/^(THESIS):\s*/i, '').trim() || '';

  const factorsBlock = parts[1]?.replace(/^(KEY FACTORS|KEY RISKS):\s*/i, '').trim() || '';
  const factors = factorsBlock
    ? factorsBlock.split(/\n?\*\s*/).map((f) => f.trim()).filter(Boolean)
    : [];

  const closingRaw = parts[2] || '';
  const closingMatch = closingRaw.match(/^(STRONGEST POINT|BIGGEST CONCERN):\s*([\s\S]*)/i);
  const closingLabel = closingMatch ? closingMatch[1] : '';
  const closingText = closingMatch ? closingMatch[2].trim() : closingRaw.trim();

  return { thesis, factors, closingLabel, closingText };
}