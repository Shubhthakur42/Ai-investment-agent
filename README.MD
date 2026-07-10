# AI Investment Research Agent

An AI agent that takes a company name, researches it using live financial data and news, and returns an investment verdict (INVEST/PASS) with transparent, auditable reasoning behind the decision.

Built for the InsideIIM × Altuni AI Labs AI Product Development Engineer (Intern) take-home assignment.

---

## Overview

Instead of a single AI model reading some data and giving an opinion, this project runs an actual **debate**: a Bull agent builds the strongest possible case *for* investing, a Bear agent builds the strongest possible case *against* it, and a Judge agent weighs both arguments and delivers a final verdict with a confidence score. All grounded in real, live-fetched financial data and news — not the model's memory.

On top of that core debate, the agent adds two layers most simple implementations skip:

1. **A stability check** — instead of running the debate once, it runs 3 independent debates in parallel on the same research data, and reports how often they agree. A single AI opinion could be a fluke; three independent runs agreeing is a real signal.
2. **An automated fact-checker** — the Judge doesn't just trust what Bull and Bear say. Every numeric claim in their arguments is programmatically checked against the actual fetched research data, and any figure that can't be traced back to real data is flagged as "unverified" and factored into the Judge's confidence.

The result is an agent that's not just answering a question, but actively auditing its own reasoning before presenting it.

---

## How to run it

### Prerequisites
- Node.js (v18+)
- A free [Groq API key](https://console.groq.com) (for the LLM)
- A free [Tavily API key](https://tavily.com) (for news search)

### Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```
GROQ_API_KEY=your_groq_key_here
TAVILY_API_KEY=your_tavily_key_here
PORT=5000
```

Run the server:
```bash
node index.js
```

### Frontend setup
```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`). Enter a company name (e.g. "Infosys", "Tata Motors", "Google") and click **Analyze**.

No database, no authentication, no additional configuration needed.

---

## How it works

### Architecture

```
User enters company name
        ↓
┌─────────────────┐
│   Researcher     │  → fetches real stock/financial data (yahoo-finance2)
│                  │  → fetches real recent news (Tavily)
│                  │  → LLM summarizes news into a clean brief
│                  │     (financial numbers are kept as exact, untouched
│                  │      facts — never rephrased by the LLM)
└────────┬─────────┘
         │
         │  (research data is now fixed — reused identically 3 times below)
         │
   ┌─────┴─────┬─────────────┬─────────────┐
   │           │             │             │
┌──▼──┐     ┌──▼──┐       ┌──▼──┐
│Debate│     │Debate│       │Debate│   × 3 independent, parallel runs
│Run 1 │     │Run 2 │       │Run 3 │
└──┬──┘     └──┬──┘       └──┬──┘
   │           │             │
   │  Each run internally:   │
   │  Bull Agent ⇄ Bear Agent │  (run in parallel via LangGraph)
   │           ↓             │
   │       Judge Agent        │  (fact-checks both sides against
   │   (verdict + confidence) │   source data, then decides)
   │           │             │
   └─────┬─────┴──────┬──────┘
         ↓             
   Aggregate 3 verdicts → majority decision + consistency % + avg. confidence
         ↓
   Displayed to user
```

### The debate mechanism
Each of the 3 runs uses LangGraph.js to orchestrate:
- **Bull Agent** and **Bear Agent** run in parallel (LangGraph waits for both before proceeding), since neither depends on the other's output — this roughly halves latency compared to running them sequentially.
- **Judge Agent** receives both arguments plus a fact-check report (see below) and must weigh them, citing which side was more convincing and why.

### The fact-checking layer
Before the Judge sees the arguments, a utility function (`verifyFacts.js`) extracts every numeric claim (percentages, currency figures) from Bull's and Bear's text and checks whether each one actually appears in the original research data. Any number that doesn't trace back to real fetched data is passed to the Judge as an "unverified figure," which the Judge is instructed to treat as a credibility weakness. This exists because of a real problem found during development — see Key Decisions below.

### The stability check
The Researcher step runs once per query (to avoid redundant API calls), but the debate (Bull → Bear → Judge) runs 3 times independently on that same research data. If all 3 runs agree, that's reported as 100% consistency. If they split, that's shown too — turning a known LLM limitation (output isn't perfectly deterministic) into a visible, honest signal about how confident the system's own judgment is.

### Tech stack
- **Frontend:** React (Vite), plain CSS with custom design tokens
- **Backend:** Node.js, Express
- **AI orchestration:** LangChain.js + LangGraph.js
- **LLM:** Groq API running Llama 3.3 70B (free tier)
- **Financial data:** yahoo-finance2 (npm package, unofficial Yahoo Finance wrapper)
- **News:** Tavily Search API

---

## Key decisions & trade-offs

**No user authentication.** Deliberately out of scope. It adds real implementation time (sessions, password handling, a database) while demonstrating nothing about AI/agent engineering, which is what this assignment evaluates. Every hour was spent on the agent's reasoning quality instead.

**Groq + Llama 3.3 70B instead of a paid model like GPT-4.** Free tier, fast inference, and rate limits (30 requests/min, 12K tokens/min) comfortably support a live demo — verified in advance rather than assumed. The trade-off: smaller open models are more prone to blending in memorized training knowledge alongside provided data, which directly caused the biggest bug found during development (below).

**A real hallucination was found and fixed — twice.** During testing, the Bull and Bear agents fabricated a specific "free cash flow" figure that did not exist anywhere in the fetched data. Investigation showed the model was blending real, memorized facts about the actual public company into its answer, despite being told not to. The first fix (stricter prompting + separating raw financial numbers from LLM-generated prose) reduced but did not eliminate the problem — later testing showed the model could still occasionally surface other real-but-uncited figures from memory. Prompting alone wasn't a reliable enough guardrail, so a second, structural fix was added: the automated fact-checking layer described above, which verifies claims programmatically rather than only telling the model not to hallucinate. This is documented in detail in the chat logs, including the exact test that reproduced and confirmed the fix (`testVerify.js`).

**Ticker resolution is a best-effort heuristic, not a solved problem.** Company name → stock ticker lookup turned out to be a genuinely hard problem. Yahoo Finance's fuzzy search occasionally returned an entirely unrelated company (e.g., searching "Infosys" once returned "HCL Infosystems Limited," a different company, because of a coincidental substring match). The current implementation trusts Yahoo's own relevance score and cross-checks exact company-name equality before accepting an alternate exchange listing, but for less common or ambiguous company names, it may still occasionally resolve incorrectly. A production version would add a disambiguation confirmation step for the user.

**Currency handling follows whatever exchange the ticker resolves to.** Some companies resolve to their NSE (India) listing in rupees, others (like Infosys in current testing) resolve to their NYSE ADR listing in US dollars. The system detects and displays the correct currency symbol for whichever listing it finds, rather than assuming one currency for all companies.

**Verdicts can vary slightly between identical queries.** This is expected, not a bug — it's caused by two independent sources of variability: (1) Tavily's news search returns live, current results that can differ between calls, and (2) LLM outputs have some inherent randomness even at low temperature. The stability check feature exists specifically to make this variability visible and measurable rather than hidden.

**Judge output is parsed via regex from structured plain text, not strict JSON.** Smaller open-weight models are less reliable at perfect JSON formatting than larger closed models. A forgiving text format with clear labeled fields (`DECISION:`, `CONFIDENCE:`, etc.) proved more robust in practice than forcing JSON and handling frequent parse failures.

---

## Example runs

*(Replace this section with 2-3 actual screenshots or copy-pasted outputs from your own testing before submission — e.g. one clear INVEST case, one clear PASS case, and ideally one case where the stability check showed less than 100% consistency, to demonstrate the feature meaningfully.)*

---

## What I'd improve with more time

- **Historical backtesting:** Run the agent against 5-10 companies with well-known past outcomes and compare its calls against what actually happened, to get a real accuracy benchmark rather than just internal consistency.
- **Better ticker resolution:** Add a disambiguation UI step when multiple plausible company matches exist, instead of silently picking one.
- **Rebuttal round:** Give Bull and Bear one round of responding directly to each other's strongest point before the Judge decides, making the debate more genuinely adversarial rather than two independent monologues.
- **Persist and compare past analyses:** Store results so a user (or evaluator) can revisit past runs for a company and see if the verdict has changed over time.
- **Graceful rate-limit handling:** Add automatic retry with backoff if Groq's per-minute token limit is hit, rather than surfacing a generic error.
- **Broader fact-checking:** The current fact-checker catches numeric claims; a more advanced version could also flag qualitative claims (e.g., "strong market position") that aren't supported by any cited evidence.

---

## AI usage disclosure

This project was built with heavy, deliberate use of AI assistance (Claude) for both architecture discussion and implementation, per the assignment's explicit instructions. Full chat transcripts are included in `ai-chat-logs/` for the bonus points. Every piece of code was tested individually (data services → agent nodes → graph orchestration → API → frontend) before integration, and every bug found during that testing — along with its root cause and fix — is documented above and in the transcripts, since the assignment requires being able to explain everything submitted.
