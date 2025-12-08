# Kritic - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Backend Setup

```bash
cd /Users/aepeul/dev/server/kritic-server

# Create environment file
cat > .env << EOF
DATABASE_URL=sqlite:///./kritic.db
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_API_KEY=your-google-key
JWT_SECRET=dev-secret-key-change-in-production
EOF

# Run migrations (creates database)
alembic upgrade head

# Start backend server
python -m app.main
```

Backend will run on http://localhost:8000

### Step 2: Frontend Setup

```bash
cd /Users/aepeul/dev/web/kritic

# Environment is already set in .env.local
# Just start the dev server
npm run dev
```

Frontend will run on http://localhost:3000

### Step 3: Test It Out!

1. Open http://localhost:3000
2. Click "Analyze Your First Response - Free"
3. Paste this sample AI response:

```
Your food delivery app idea is fantastic! The market is huge ($150B) and growing rapidly.
With your unique features, you could easily capture 1% market share in year one.
Building the MVP will only take 2-3 months and cost around $50k.
You'll be profitable within 6 months!
```

4. Select GPT-5 and Claude
5. Click "Run Reality Check"
6. Wait 20-30 seconds for brutal honesty!

## 🔑 Getting API Keys (Free Tier Available)

### OpenAI (GPT-5)
1. Go to https://platform.openai.com
2. Sign up / Login
3. Go to API Keys section
4. Create new key
5. Copy and paste into `.env` as `OPENAI_API_KEY`

### Anthropic (Claude)
1. Go to https://console.anthropic.com
2. Sign up / Login
3. Go to API Keys
4. Create new key
5. Copy and paste into `.env` as `ANTHROPIC_API_KEY`

### Google (Gemini)
1. Go to https://ai.google.dev
2. Sign up / Login
3. Get API Key
4. Copy and paste into `.env` as `GOOGLE_API_KEY`

## 📝 Notes

- **Database**: MVP uses SQLite (no PostgreSQL needed for testing)
- **Credits**: You start with 100 free credits
- **Auth**: Mock authentication (no login needed for MVP)
- **Payment**: Mock payment (no Stripe needed for MVP)

## 🐛 Troubleshooting

### Backend won't start?
```bash
# Make sure you have Python 3.11+
python3 --version

# Install dependencies
pip install fastapi uvicorn sqlalchemy alembic pydantic httpx

# Check if database exists
ls -la kritic.db
```

### Frontend won't start?
```bash
# Make sure you have Node 18+
node --version

# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### API calls failing?
- Check if backend is running on port 8000
- Check `.env.local` has correct API URL
- Check browser console for errors

## 🎉 That's It!

You now have a working AI Reality Check platform. Try analyzing different AI responses and see how optimistic they really are!

---

**Questions?** Check the main [README.md](./README.md) for detailed documentation.
