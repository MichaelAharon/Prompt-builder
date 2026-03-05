# ⚡ Vibe Prompt Generator

Turn plain-language ideas into perfect, structured AI prompts — with smart engine
recommendations for **Claude**, **ChatGPT**, and **Gemini**.

---

## How it works

1. **Describe your idea** in plain language ("I want a dark-mode Shopify dashboard")
2. **Answer 7 quick questions** — task type, output format, role, audience, constraints, tone, iteration stage
3. **Get a ranked engine recommendation** — Claude vs ChatGPT vs Gemini scored against your answers
4. **Receive a structured S.C.A.F.F. prompt** — Role · Situation · Challenge · Audience · Format · Constraints · Think First · Do Not · Success Criteria
5. **Copy and paste** into your chosen AI tool

---

## Tech stack

| Layer      | Technology                      |
|------------|---------------------------------|
| Frontend   | React 18 + TypeScript + Vite    |
| Animations | Framer Motion (21st.dev scroll) |
| Backend    | Node.js + Express               |
| AI         | Anthropic Claude API (Sonnet 4) |
| Security   | Helmet · CORS · Rate Limiting   |

---

## Project structure

```
vibe-prompt-generator/
│
├── server/                         # Express backend
│   ├── index.js                    # Server entry point
│   ├── constants.js                # Scoring logic, engine data
│   ├── routes/
│   │   └── api.js                  # GET /api/health, POST /api/generate
│   └── package.json                # { "type": "module" }
│
├── client/                         # React + TypeScript frontend
│   ├── index.html
│   ├── vite.config.ts              # Dev proxy → :3001, path alias @/
│   ├── tsconfig*.json
│   └── src/
│       ├── main.tsx                # ReactDOM.createRoot
│       ├── App.tsx                 # Root — step state machine
│       ├── styles/
│       │   └── global.css          # Reset, fonts, keyframes
│       ├── lib/
│       │   ├── constants.ts        # Types, ENGINES, QUESTIONS, T (tokens)
│       │   └── api.ts              # fetch wrappers → /api/*
│       ├── hooks/
│       │   ├── useCopyToClipboard.ts
│       │   └── useIsMobile.ts
│       ├── components/
│       │   ├── Button.tsx
│       │   ├── Card.tsx
│       │   ├── Spinner.tsx
│       │   ├── TopBar.tsx
│       │   ├── ContainerScroll.tsx # 21st.dev scroll animation
│       │   └── EngineRow.tsx
│       └── pages/
│           ├── HeroPage.tsx        # Landing with ContainerScroll
│           ├── InputPage.tsx       # Step 1 — plain language input
│           ├── QuestionsPage.tsx   # Step 2 — 7 questions + API call
│           └── ResultPage.tsx      # Step 3 — engine recs + prompt
│
├── .env.example                    # Copy to .env
├── .gitignore
├── package.json                    # Root scripts
└── README.md
```

---

## Quick start

### Prerequisites

- **Node.js 18+**
- An **Anthropic API key** → [console.anthropic.com](https://console.anthropic.com)

### 1 — Install

```bash
git clone <your-repo-url>
cd vibe-prompt-generator

# Install server deps
npm install

# Install client deps
cd client && npm install && cd ..
```

Or use the convenience script:

```bash
npm run install:all
```

### 2 — Environment variables

```bash
cp .env.example .env
```

Open `.env` and set your key:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 3 — Run in development

```bash
npm run dev
```

This starts two processes in parallel:
- **Backend** at `http://localhost:3001`
- **Frontend** at `http://localhost:5173` (Vite, with HMR)

Open **http://localhost:5173**

---

## Production build

```bash
# Build the React app into client/dist
npm run build

# Start the production server (serves API + frontend on one port)
npm start
```

Open **http://localhost:3001**

The Express server serves the built frontend statically and handles all API calls.

---

## API reference

### `GET /api/health`

```json
{
  "status": "ok",
  "timestamp": "2025-03-05T10:00:00.000Z",
  "model": "claude-sonnet-4-20250514"
}
```

---

### `POST /api/generate`

**Request body:**

```json
{
  "userInput": "I want to build a sales dashboard with charts",
  "answers": {
    "task_type":     "Build a UI / Frontend",
    "output_format": "Working code",
    "ai_role":       "Senior developer",
    "audience":      "Just me (vibe coder)",
    "constraints":   "No external libraries",
    "tone":          "Production-ready / strict",
    "iteration":     "Starting from scratch"
  }
}
```

**Response:**

```json
{
  "prompt": "ROLE\nYou are a senior frontend developer...",
  "engineRecs": [
    {
      "key": "claude",
      "score": 14,
      "pct": 78,
      "engine": { "name": "Claude", "vendor": "Anthropic", "dot": "#F59E0B", ... },
      "why": "Strong at component architecture and precise code output."
    }
  ],
  "topEngine": "Claude",
  "usage": { "input_tokens": 312, "output_tokens": 487 }
}
```

**Rate limit:** 20 requests / 15 minutes per IP.

---

## Deployment

### Railway (easiest, ~5 min)

1. Push to GitHub
2. [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add environment variables in Railway dashboard
4. Set **Build command**: `npm run install:all && npm run build`
5. Set **Start command**: `npm start`
6. Deploy — you get a public HTTPS URL instantly

### Render

1. New Web Service on [render.com](https://render.com)
2. **Build command**: `npm run install:all && npm run build`
3. **Start command**: `npm start`
4. Add env vars, deploy

### Fly.io

```bash
npm install -g flyctl
fly auth login
fly launch
fly secrets set ANTHROPIC_API_KEY=sk-ant-your-key
fly deploy
```

### VPS (DigitalOcean / Hetzner)

```bash
git clone <repo> && cd vibe-prompt-generator
npm run install:all && npm run build
cp .env.example .env        # fill in values
npm install -g pm2
pm2 start server/index.js --name vpg
pm2 save && pm2 startup
```

Add Nginx to reverse-proxy port 3001 → 80/443.

---

## Environment variables

| Variable           | Required | Default                 | Description                              |
|--------------------|----------|-------------------------|------------------------------------------|
| `ANTHROPIC_API_KEY`| ✅        | —                       | Your Anthropic API key                   |
| `PORT`             | No       | `3001`                  | Server port                              |
| `CLIENT_ORIGIN`    | No       | `http://localhost:5173` | Frontend URL for CORS (prod: your domain)|
| `NODE_ENV`         | No       | `development`           | Set to `production` for prod server      |

---

## Cost

Each run uses ~700 input + ~500 output tokens with Claude Sonnet 4.

| Volume       | Cost     |
|--------------|----------|
| 1 run        | ~$0.001  |
| 100 runs     | ~$0.10   |
| 1 000 runs   | ~$1.00   |
| 10 000 runs  | ~$10.00  |

The rate limiter (20 req/15 min/IP) prevents runaway costs if you make the tool public.

---

## License

MIT
