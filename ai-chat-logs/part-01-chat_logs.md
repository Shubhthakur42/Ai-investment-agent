# AI Chat Logs — Key Technical Exchanges

Full raw transcripts are included alongside this file. This document curates the exchanges that best show the actual engineering process — architecture reasoning, bugs found through testing, and how they were diagnosed and fixed. Minor conversational back-and-forth ("looks good, next step" etc.) is trimmed for readability; no technical content has been altered.

---

## 1. Why a debate architecture instead of a single linear agent

**Me:** I have to make this unique — an AI agent that decides invest or pass, using LangGraph. How do I make it different from what everyone else will build?

**Claude:** Since basically everyone will build "a LangGraph agent that searches the web and outputs invest/pass," the real differentiation is in judgment and rigor, not flashier libraries. Use LangGraph properly instead of as a fancy sequential pipeline: a **bull agent** builds the investment case, a **bear agent** actively tries to tear it down, and a **judge agent** weighs both and makes the final call. This is a genuinely different architecture from "search → summarize → decide," and it's very demo-able.

**Me:** Should Bull and Bear run one after another, or can they be faster?

**Claude:** Since Bull and Bear don't depend on each other's output — only on the Researcher's data — you can run them in parallel using LangGraph. This keeps the app fast instead of making the user wait for one agent to finish before the next starts.

*→ Implemented as: `researcher → (bullAgent + bearAgent in parallel) → judge`, verified via timing test to complete in ~7 seconds end-to-end.*

---

## 2. Bug #1 — Caught a real LLM hallucination through testing

**Me (after running a test script):**
```
=== BEAR CASE ===
...The negative free cash flow of ₹26,823 crore in FY26...
```

**Claude:** Look closely — both the Bull and Bear cases mention a specific free cash flow figure. Check `getFinancialData`: it never fetches free cash flow. That number doesn't exist anywhere in your `companyData`. The model made it up — and made it up consistently in both arguments, which is exactly the kind of "confidently wrong" behavior that would badly hurt your grade if an evaluator fact-checks it.

This is a known weakness of smaller open models like Llama on Groq — despite instructions not to invent facts, they can still fabricate plausible-sounding numbers, especially financial ones.

**Fix applied:** Separated verified financial numbers (kept as exact, untouched facts) from LLM-generated prose entirely, and added an explicit instruction telling the model to ignore any outside/memorized knowledge about the company.

**Follow-up finding:** Testing again later showed the fix reduced but didn't fully eliminate the problem — the model could still occasionally surface other real, memorized figures about the actual company. Prompting alone wasn't a fully reliable guardrail.

---

## 3. Bug #1, part 2 — Building an automated fact-checker instead of trusting prompts alone

**Me:** I want to make the agent smarter — what does that actually mean here, not just adding more AI calls?

**Claude:** A smarter agent isn't one that uses more tokens — it's one that knows when it doesn't know something, reasons over conflicting evidence explicitly, and is consistent and explainable. A meaningfully more advanced upgrade: have the Judge specifically check whether each side's claims are actually supported by real numbers in the original data, and penalize confidence if not. That directly builds on the hallucination bug already found — instead of just preventing hallucination through prompting, the agent actively verifies its own reasoning.

**Implementation:** `verifyFacts.js` — extracts numeric claims from Bull/Bear text via regex, checks each against the actual research data, and passes any unverified figures to the Judge as a flagged credibility weakness.

**Verification test:**
```javascript
const fakeArgument = `The company's operating margin of 21.1% and free cash flow 
growth of 25.2% year-on-year are strong indicators, along with total expenses 
of ₹36,659.00 crore.`;

const result = findUnverifiedClaims(fakeArgument, sourceBrief);
console.log('Unverified claims found:', result);
```
**Output:** `Unverified claims found: [ '21.1%', '25.2%', '₹36659.00' ]`

This confirmed the detection logic correctly identifies fabricated figures in isolation, independent of whether any given live run happens to hallucinate.

---

## 4. Bug #2 — Wrong ticker resolved to the wrong company entirely

**Me:**
```
"ticker": "HCL-INSYS.NS",
"marketCap": 3861632256,
"profitMargin": -1.52291
```
this i got [for a search for "Infosys"]

**Claude:** This reveals the fix actually made things worse. Look at the ticker — `HCL-INSYS.NS` isn't even Infosys, it's a completely different, obscure entity. This is why market cap shows ₹3.86 billion (real Infosys is worth roughly ₹6 trillion) — we're confidently analyzing the wrong company entirely and presenting it as Infosys. This is more dangerous than the earlier bug, because the numbers look "plausible enough" at a glance unless you know the real company's scale.

**Diagnosis (via a raw debug script printing Yahoo's actual search results):** The scoring logic used a substring match, and "HCL Infosystems Limited" literally contains the substring "infosys" — a classic substring-matching trap.

**Fix:** Switched to trusting Yahoo's own relevance score plus exact company-name equality checks before accepting an alternate exchange listing, rather than a naive substring/suffix filter.

---

## 5. Bug #3 — Currency mismatch (not actually a "decimal" bug as first assumed)

**Me:** the stock price shows like ₹10.965 which seems wrong

**Claude:** This isn't a decimal-shift bug — Yahoo Finance's fuzzy search was matching Infosys's **US-listed ADR** (traded on NASDAQ in **US dollars**), not the Indian NSE listing. An Infosys ADR genuinely trades in that range in dollars — we were just hardcoding the ₹ symbol everywhere regardless of which exchange the data actually came from.

**Fix:** Capture the real `currency` field from the API response and select the correct symbol (`₹`, `$`, etc.) dynamically instead of assuming one currency for every company.

---

## 6. Design decisions made and explained, not defaulted into

- **No user authentication:** explicitly discussed and scoped out — "it adds implementation time without demonstrating any AI/agent skill, which is what this assignment evaluates."
- **Groq + Llama 3.3 70B over a paid model:** chosen for free tier + speed, with rate limits explicitly checked in advance (30 req/min, 12K tokens/min) to make sure a live demo wouldn't fail mid-presentation.
- **Judge output parsed via regex from labeled plain text, not strict JSON:** a deliberate choice after recognizing that smaller open models are less reliable at perfect JSON formatting — a pragmatic trade-off, not an oversight.
- **Stability check (3 parallel runs + consistency %):** added specifically to turn a known limitation (LLM output isn't perfectly deterministic) into a visible, honest, demonstrable feature rather than hiding it.

---

*Full unedited chat transcripts follow in the accompanying files in this folder.*
