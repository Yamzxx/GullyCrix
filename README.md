# 🏏 GULLY CRIX

> Fast, street-style cricket scoring app with **Gully AI** — your personal cricket rules analyst.

![GULLY CRIX](public/favicon.svg)

---

## What is this?

**GULLY CRIX** is a local-first cricket scoring app for gully (street) cricket. Score matches live, track stats, and get cricket rules explained by **Gully AI** — a built-in AI cricket assistant.

---

## Features

- 🏏 **Live Cricket Scoring** — Runs, wickets, overs, extras (wides, no-balls)
- 📊 **Match History** — Filter by All / Live / Complete / Abandoned
- 📈 **Statistics** — Runs, sixes, fours, wickets, overs, scoring rate, highest total, team ledger
- 👤 **Profile** — Custom scorer name, sound effects toggle, animations toggle
- 💾 **Persistent Storage** — All data saved locally in `localStorage`
- 📤 **JSON Export** — Export all match data
- 🗑️ **Delete with Confirmation** — Safe match deletion
- 🤖 **Gully AI** — Floating AI chatbot for cricket rules, scoring help, and match stats

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. (Optional) Enable live AI responses

Create a `.env` file and add your Gemini API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

> Without a key, Gully AI works in **offline mode** with a built-in cricket knowledge base. No features are locked.

### 3. Start the server

```bash
npm start
# or
node server/index.js
```

### 4. Open the app

```
http://localhost:5000
```

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
│   └── index.js               # Express backend + /api/chat endpoint
├── .env                       # Your local secrets (not committed)
├── .env.example               # Template for environment variables
├── package.json
└── README.md
```

---

## Gully AI Chatbot

The Gully AI chatbot is a **floating button** in the bottom-right corner of every page.

Click it to open a cricket assistant that can:
- Explain **gully cricket rules** (one-tip-one-hand, boundary-out, baby overs)
- Answer **official cricket rules** (LBW, wides, no-balls, run rate, DLS)
- Show your **match statistics** and history
- Help with **scoring edge cases**

**With `GEMINI_API_KEY`:** Powered by Gemini 1.5 Flash for live, context-aware responses.  
**Without key:** Uses a built-in cricket knowledge base (always works offline).

---

## Color Palette

| Color | Hex | Used for |
|-------|-----|----------|
| Dark Forest Green | `#102B17` | Sidebar, cards, buttons |
| Deepest Green | `#0B1C10` | Backgrounds, text |
| Cricket Green | `#4CAF50` | Active states, icons |
| Cream | `#F8F5E8` | Page background, text |
| Yellow/Amber | `#F5C451` | Active nav, highlights |
| Red | `#E52525` | Plus button, delete, wickets |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Server health + AI config status |
| `POST` | `/api/chat` | Send a message to Gully AI |

### POST `/api/chat`

```json
{
  "message": "What is LBW?",
  "history": [...],
  "matchContext": {
    "profileName": "Gully scorer",
    "matches": [...],
    "stats": { "runs": 20, "wkts": 0, ... }
  }
}
```

---

## Enabling Gemini AI

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/)
2. Add to your `.env` file:
   ```
   GEMINI_API_KEY=your_key_here
   ```
3. Restart the server — Gully AI will automatically use Gemini 1.5 Flash

---

## Data & Privacy

- All match data is stored **only on your device** in `localStorage`
- Nothing is sent to any server (except your chat messages to `/api/chat`)
- Use **Export all data as JSON** in Profile to back up your matches
- Use **Delete all matches** in Profile to wipe all data

---

## GitHub

```
https://github.com/Yamzxx/GullyCrix
```

