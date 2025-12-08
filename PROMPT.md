# AI Response Reality Check Platform - MVP Development Brief

## 🎯 Core Concept
We're building a SaaS platform that performs critical analysis on AI-generated responses (especially from optimistic models like ChatGPT). When users paste an AI's suggestion/idea/proposal, our system queries 2-3 premium LLMs to provide a cold, realistic evaluation - exposing over-optimism, finding existing competitors, checking market size accuracy, and assessing feasibility.

## 🎨 Frontend Requirements (Next.js)

### Tech Stack
- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- React Query for state management
- Vercel for deployment

### Key Pages & Features

**1. Landing Page (`/`)**
- Hero section with clear value prop: "Stop believing ChatGPT's sugar-coated lies. Get brutal reality checks."
- Problem statement: Show side-by-side comparison (ChatGPT's optimistic response vs our realistic analysis)
- CTA: "Analyze Your First Response - Free"
- Pricing preview: Credit-based system

**2. Analysis Dashboard (`/analyze`)**
- Main textarea: Paste AI response (ChatGPT, etc.)
- Optional context field: "What did you ask the AI?"
- Model selector: Choose which LLMs to use for verification (GPT-5, Claude, Gemini)
- "Run Reality Check" button (shows credit cost before running)
- Loading state with progress indicator

**3. Results Page (`/results/[id]`)**
Critical sections to display:
- **Optimism Bias Score**: Visual gauge (0-100, where 100 = extremely optimistic)
- **Original vs Reality**: Two-column comparison
- **Competitor Analysis**: List of existing solutions found via web search
- **Market Size Reality Check**: Claimed vs actual numbers
- **Feasibility Assessment**: Technical, financial, timeline reality
- **Risk Factors**: Bullet points of what could go wrong
- **Final Verdict**: Score out of 10 with explanation
- Export/Share buttons

**4. Credit System (`/credits`)**
- Current credit balance (prominent display)
- Purchase options: $10 = 100 credits, $25 = 300 credits, $50 = 700 credits
- Usage history table
- Per-analysis cost calculator

**5. Auth Pages**
- `/login` - Email/password
- `/signup` - Simple registration
- `/profile` - Basic user settings

### UI/UX Principles
- Dark mode default (matches "brutal truth" vibe)
- Red/orange accents for warnings, green for validated points
- Clean, professional, no-BS design
- Mobile responsive
- Fast: Optimize for Core Web Vitals

### State Management
- User credits (global state)
- Analysis history (cached)
- Current analysis in progress (real-time updates)

---

## ⚙️ Backend Requirements (FastAPI)

### Tech Stack
- FastAPI (Python 3.11+)
- PostgreSQL for data persistence
- Redis for caching and rate limiting
- Pydantic for validation
- SQLAlchemy ORM
- Async support throughout
- Railway for deployment

### Core API Endpoints

**Authentication**
```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/refresh
GET /api/auth/me
```

**Analysis Engine**
```
POST /api/analyze
  Body: {
    original_response: string,
    context: string (optional),
    models: ["gpt5", "claude", "gemini"],
  }
  Returns: analysis_id

GET /api/analyze/{analysis_id}
  Returns: Real-time analysis progress or final results

GET /api/analyze/history
  Returns: User's past analyses
```

**Credits**
```
GET /api/credits/balance
POST /api/credits/purchase
  Body: { amount: number, payment_method: stripe_token }
  
GET /api/credits/history
```

### Analysis Pipeline Architecture

**Step 1: Input Processing**
- Validate and sanitize user input
- Extract key claims from original AI response
- Estimate credit cost (based on input length + selected models)

**Step 2: Multi-Model Verification**
- Query selected LLMs in parallel with specialized prompts:
  - Model 1 (GPT-5): "Act as a skeptical investor. Find flaws in this idea..."
  - Model 2 (Claude): "Act as a competitor analyst. List all existing solutions..."
  - Model 3 (Gemini): "Act as a market researcher. Verify these numbers..."
  
**Step 3: Web Search Integration**
- Use web_search to find actual competitors
- Verify market size claims
- Check if similar ideas failed before

**Step 4: Synthesis**
- Aggregate responses from all models
- Calculate optimism bias score (algorithm: count positive claims in original vs negative findings)
- Generate structured JSON output

**Step 5: Scoring Algorithm**
```python
final_score = (
    feasibility_score * 0.3 +
    market_reality_score * 0.3 +
    competition_score * 0.2 +
    cost_accuracy_score * 0.2
)
optimism_bias = original_positivity - reality_check_positivity
```

### Database Schema

**Users Table**
```sql
- id (UUID, primary key)
- email (unique)
- password_hash
- credits_balance (integer, default 100)
- created_at
- updated_at
```

**Analyses Table**
```sql
- id (UUID, primary key)
- user_id (foreign key)
- original_response (text)
- context (text, nullable)
- models_used (json array)
- status (enum: pending, processing, completed, failed)
- results (jsonb)
- credits_used (integer)
- created_at
```

**Transactions Table**
```sql
- id (UUID, primary key)
- user_id (foreign key)
- type (enum: purchase, usage, refund)
- amount (integer)
- description (text)
- created_at
```

### External API Integration

**LLM APIs**
- OpenAI API (GPT-5)
- Anthropic API (Claude)
- Google AI API (Gemini)
- Implement retry logic and fallbacks
- Rate limiting per user

**Web Search**
- Integrate search API (Brave/Serper) for competitor research
- Cache results to reduce costs

**Payment**
- Stripe for credit purchases
- Webhook handling for payment confirmation

### Security & Performance

**Security**
- JWT-based authentication
- Rate limiting: 10 analyses/hour for free users, unlimited for paid
- Input sanitization to prevent prompt injection
- API key rotation

**Performance**
- Redis caching for frequently analyzed topics
- Async processing for long-running analyses
- WebSocket support for real-time progress updates
- Database indexing on user_id, created_at

**Monitoring**
- Log all API calls
- Track credit usage patterns
- Error tracking (Sentry integration ready)

---

## 🚀 MVP Priorities (Build in this order)

### Phase 1 (Day 1 - Core Flow)
1. Basic Next.js setup with landing + analyze page
2. FastAPI with single analysis endpoint
3. Integration with 2 LLMs (GPT-5 + Claude)
4. Simple credit deduction (no payment yet)
5. Results display (basic version)

### Phase 2 (Day 1-2 - Essential Features)
6. User authentication (signup/login)
7. Credit system (hardcoded 100 free credits)
8. Analysis history page
9. Web search integration for competitor finding
10. Improved results page with all sections

### Phase 3 (Post-MVP)
- Payment integration (Stripe)
- Advanced analytics dashboard
- Export features
- Email notifications
- API for developers

---

## 📋 Environment Variables Needed

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxx
```

**Backend (.env)**
```
DATABASE_URL=postgresql://user:pass@localhost/dbname
REDIS_URL=redis://localhost:6379
JWT_SECRET=xxx
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
GOOGLE_API_KEY=xxx
SEARCH_API_KEY=xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

---

## 💡 Critical Prompts for LLM Analysis

**Prompt Template for Reality Check:**
```
You are a brutally honest business analyst. A user received this response from an AI assistant:

"{original_response}"

Your job: Identify overoptimism, find competitors, verify claims, and assess feasibility.

Provide:
1. Optimism bias score (0-100)
2. List of existing competitors (with URLs)
3. Market size reality check
4. Technical feasibility concerns
5. Financial reality check
6. Top 5 risk factors
7. Final score (0-10) with reasoning

Be specific. Use data. Be harsh but fair.
```

---

## 🎨 Design Inspiration
- Linear.app (clean, fast, professional)
- Vercel Dashboard (dark mode, sharp)
- Stripe Dashboard (clear data visualization)

## Success Metrics for MVP
- 100 users sign up
- 50 users run at least 1 paid analysis
- Average analysis takes <30 seconds
- <5% error rate on analysis pipeline

---

**Now go build this. Fast and functional over perfect. Ship it in 24 hours.**