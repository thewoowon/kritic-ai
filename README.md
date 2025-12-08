# Kritic - AI Response Reality Check Platform

Stop believing ChatGPT's sugar-coated lies. Get brutal reality checks on AI-generated responses.

## 🎯 What is Kritic?

Kritic is a SaaS platform that performs critical analysis on AI-generated responses. When users paste an AI's suggestion/idea/proposal, our system queries 2-3 premium LLMs to provide a cold, realistic evaluation - exposing over-optimism, finding existing competitors, checking market size accuracy, and assessing feasibility.

## 🚀 Features

- **Multi-LLM Analysis**: Query GPT-5, Claude, and Gemini with skeptical prompts
- **Competitor Discovery**: Automatically find existing solutions via web search
- **Market Reality Check**: Verify market size claims and financial projections
- **Optimism Bias Score**: Get a quantitative measure of AI overoptimism (0-100)
- **Credit-Based Pricing**: Pay as you go - no subscriptions
- **Real-time Processing**: Get results in 20-30 seconds

## 🛠 Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: FastAPI (Python), PostgreSQL, Redis
- **LLMs**: OpenAI GPT-5, Anthropic Claude, Google Gemini
- **Deployment**: Vercel (Frontend), Railway (Backend)

## 📦 Installation

### Frontend Setup

```bash
cd /Users/aepeul/dev/web/kritic

# Install dependencies
npm install

# Create .env.local file with:
NEXT_PUBLIC_API_URL=http://localhost:8000

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Backend Setup

```bash
cd /Users/aepeul/dev/server/kritic-server

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API keys:
DATABASE_URL=postgresql://user:pass@localhost/kritic
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
GOOGLE_API_KEY=xxx

# Run database migrations
alembic upgrade head

# Start server
python -m app.main
```

Visit [http://localhost:8000/docs](http://localhost:8000/docs) for API documentation

## 🔑 Required API Keys

You'll need API keys from:
- OpenAI (https://platform.openai.com)
- Anthropic (https://console.anthropic.com)
- Google AI (https://ai.google.dev)

## 📖 Usage

1. **Paste AI Response**: Copy any ChatGPT, Claude, or other AI-generated idea
2. **Select Models**: Choose which LLMs to use for verification (2-3 recommended)
3. **Run Reality Check**: Click analyze and wait 20-30 seconds
4. **Review Results**: See optimism score, competitors, risks, and feasibility

## 🎨 Pages

- `/` - Landing page with value proposition
- `/analyze` - Main analysis dashboard
- `/results/[id]` - Detailed analysis results
- `/credits` - Buy credits and view transaction history

## 📊 API Endpoints

### Analysis
- `POST /api/analyze` - Create new analysis
- `GET /api/analyze/{id}` - Get analysis results
- `GET /api/analyze/history` - Get user's analysis history

### Credits
- `GET /api/credits/balance` - Get credit balance
- `POST /api/credits/purchase` - Purchase credits
- `GET /api/credits/history` - Get transaction history

## 🧪 Testing

For MVP, a default test user is created automatically with 100 free credits.

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`: Your Railway backend URL (e.g., `https://your-app.railway.app`)
4. Deploy!

### Backend (Railway)

1. Push code to GitHub
2. Go to [Railway](https://railway.app) and create a new project from your GitHub repo
3. Add PostgreSQL database (Railway will set `DATABASE_URL` automatically)
4. Configure environment variables:
   ```
   OPENAI_API_KEY=your_key
   ANTHROPIC_API_KEY=your_key
   GOOGLE_API_KEY=your_key
   DEBUG=False
   BACKEND_CORS_ORIGINS=https://your-vercel-app.vercel.app
   ```
5. Deploy!

After deployment, update your frontend's `NEXT_PUBLIC_API_URL` to point to your Railway backend URL.

## 📝 Next Steps

- [ ] Implement JWT authentication
- [ ] Add Stripe payment integration
- [ ] Web search integration for competitor discovery
- [ ] Email notifications
- [ ] Export results as PDF
- [ ] Share analysis via link

## 📄 License

MIT

---

**Built with Claude Code** 🤖
