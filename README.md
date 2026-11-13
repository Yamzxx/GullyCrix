# 🏏 GULLY CRIX

> Fast, street-style cricket scoring app with **Gully AI** — your personal cricket rules analyst.

🔗 **Live Application URL:** [https://gully-crix-en.vercel.app/](https://gully-crix-en.vercel.app/)  
📂 **GitHub Repository:** [https://github.com/Yamzxx/GullyCrix](https://github.com/Yamzxx/GullyCrix)

---

## Features

- 🏏 **Live Cricket Scoring** — Runs, wickets, overs, extras (wides, no-balls, free hits)
- 📊 **Match History** — Filter by All / Live / Complete / Abandoned
- 📈 **Statistics** — Runs, sixes, fours, wickets, overs, scoring rate, highest total, team ledger
- 👤 **Profile** — Custom scorer name, sound effects toggle, animations toggle
- 💾 **Persistent Storage** — All data saved locally in `localStorage`
- 📤 **JSON Export** — Export all match data
- 🗑️ **Delete with Confirmation** — Safe match deletion
- 🤖 **Gully AI** — Highlighted floating cricket assistant for rules, scoring help, and live match stats

---

## Run Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure a free AI key (optional)

Copy `.env.example` to `.env` and add **one** API key:
- **Groq (100% Free, no card):** `GROQ_API_KEY=...` from [console.groq.com/keys](https://console.groq.com/keys)
- **Google Gemini (Free tier):** `GEMINI_API_KEY=...` from [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- **xAI Grok:** `GROK_API_KEY=...` from [console.x.ai](https://console.x.ai/)

> Without a funded API key, Gully AI still responds using its built-in cricket rulebook and your local match stats.

### 3. Start the server

```bash
npm start
```

Open `http://localhost:5000`.

---

## Deploy on Render

1. Push this repo to GitHub (`https://github.com/Yamzxx/GullyCrix`).
2. Sign in to [render.com](https://render.com) → **New +** → **Web Service** (or **Blueprint** using `render.yaml`).
3. Connect the `Yamzxx/GullyCrix` repository with these settings:
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
4. Under **Environment** → **Environment Variables**, add your free AI key:
   - Key: `GROQ_API_KEY` (or `GEMINI_API_KEY` / `GROK_API_KEY`)
   - Value: *(your API key)*
5. Click **Deploy Web Service**.

---

## Project Structure

```
GullyCrix/
├── public/                    # Frontend (served as static files)
│   ├── index.html
│   ├── favicon.svg
│   └── assets/
│       ├── index-BJ4u41Uh.js  # App bundle (React SPA + Gully AI chatbot)
│       └── index-C54n_v_5.css # App styles
├── server/
│   └── index.js               # Express backend + /api/chat + /api/health
├── render.yaml                # Render Blueprint config
├── .env.example               # Template for environment variables
├── package.json
└── README.md
```
