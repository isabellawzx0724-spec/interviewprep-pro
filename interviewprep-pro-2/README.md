# Interview Navigator

A bilingual interview preparation web product designed for the Chinese job market.

## What it does

- Aggregates interview-prep signals for a company + role combination.
- Supports bilingual UI (Chinese / English).
- Generates interview questions and answer frameworks from:
  - the job description,
  - the candidate's resume highlights,
  - interview type,
  - retrieved interview signals.
- Includes a post-interview feedback loop so the database improves over time.
- Ships with scraper adapters for Nowcoder and Xiaohongshu.

## Product modules included

1. Web-wide interview digest
2. JD-driven likely questions
3. Resume deep-dive challenges
4. Interview-type-specific question bank
5. Culture fit summary
6. One-page cheat sheet

## Tech stack

- Frontend: React + Vite
- Backend: Express
- AI generation: OpenAI Responses API
- Scraping adapters: Playwright + Cheerio

## Important deployment note

The scraper layer is implemented, but whether it can be used in production depends on the target platform's access rules, robots policies, login requirements, anti-bot controls, and your own legal/compliance review. In this codebase, live scraping is disabled by default and only runs when `ALLOW_LIVE_SCRAPE=true` is explicitly set.

## Setup

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment

Copy the example env file:

```bash
cp .env.example .env
```

Then set at least:

```bash
OPENAI_API_KEY=...
PORT=8787
ALLOW_LIVE_SCRAPE=false
```

Optional cookies for logged-in scraping sessions:

```bash
XIAOHONGSHU_COOKIE=...
NOWCODER_COOKIE=...
```

### 3. Run backend

```bash
cd backend
npm run dev
```

### 4. Run frontend

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`, backend on `http://localhost:8787`.

## API endpoints

### Generate prep pack

`POST /api/interview/generate`

```json
{
  "company": "Tencent",
  "role": "Business Development Intern",
  "jd": "Business Operations, customer support, merchant coordination...",
  "resume": "Banking internships, client analysis, due diligence...",
  "interviewType": "professional",
  "language": "zh"
}
```

### Get existing interview signals

`GET /api/interview/insights?company=...&role=...&interviewType=...`

### Save post-interview feedback

`POST /api/interview/feedback`

```json
{
  "company": "Tencent",
  "role": "Business Development Intern",
  "interviewType": "professional",
  "askedQuestions": ["Tell me about a merchant case you drove"],
  "style": "project-heavy",
  "difficulty": "medium",
  "notes": "Strong follow-up on metrics and ownership"
}
```

## Product optimization suggestions already baked into this version

- Focus on **resume risk probing**, not generic interview Q&A.
- Position the product as a **Chinese-market interview intelligence platform**, not a plain AI chatbot.
- Treat post-interview feedback as the defensibility layer.
- Keep the UI intentionally minimal and premium so it feels credible for serious candidates.

## Recommended next upgrades

- Add user authentication and saved interview projects.
- Add company-role benchmarking dashboards.
- Add voice mock interview mode.
- Add RAG storage with vector search instead of the current local mock corpus.
- Add moderation, deduplication, and source trust scoring for scraped content.
- Add payment/subscription flow.
