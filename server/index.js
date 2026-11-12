import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// ─── Match & Stats Calculator (from real stored localStorage matches) ─────────
function computeMatchSummary(matches = []) {
  let totalRuns = 0;
  let totalWickets = 0;
  let totalSixes = 0;
  let totalFours = 0;
  let totalBalls = 0;
  let totalExtras = 0;
  let completedMatches = 0;
  let highestTotal = null;
  const recentResults = [];

  matches.forEach((m) => {
    const teams = m?.config?.teams || [{ name: "Team A" }, { name: "Team B" }];
    const battingFirstIdx = m?.config?.battingFirst ?? 0;
    const events = Array.isArray(m?.events) ? m.events : [];
    const cursor = typeof m?.cursor === "number" ? m.cursor : events.length;
    const activeEvents = events.slice(0, cursor);

    let inningsIdx = 0;
    const innings = [
      { runs: 0, wkts: 0, balls: 0, extras: 0 },
      { runs: 0, wkts: 0, balls: 0, extras: 0 },
    ];

    activeEvents.forEach((ev) => {
      if (ev.type === "endInnings") {
        inningsIdx = Math.min(1, inningsIdx + 1);
        return;
      }
      if (ev.type === "ball") {
        const inn = innings[inningsIdx];
        const r = ev.runs || 0;
        const extraRuns = ev.extraRuns || (ev.kind === "wide" || ev.kind === "noball" ? 1 : 0);
        const totalBallRuns = r + (ev.kind === "wide" || ev.kind === "noball" ? (ev.runs ? 0 : 0) : 0);
        inn.runs += r;
        totalRuns += r;

        if (ev.kind === "wide" || ev.kind === "noball") {
          inn.extras += Math.max(1, extraRuns);
          totalExtras += Math.max(1, extraRuns);
        } else {
          inn.balls += 1;
          totalBalls += 1;
        }
        if (ev.kind === "wicket") {
          inn.wkts += 1;
          totalWickets += 1;
        }
        if (r === 6 && ev.kind !== "wide") totalSixes += 1;
        if (r === 4 && ev.kind !== "wide") totalFours += 1;
        void totalBallRuns;
      }
    });

    const firstTeam = teams[battingFirstIdx]?.name || "Team 1";
    const secondTeam = teams[1 - battingFirstIdx]?.name || "Team 2";
    const inn1 = innings[0];
    const inn2 = innings[1];

    [
      { team: firstTeam, ...inn1 },
      { team: secondTeam, ...inn2 },
    ].forEach((entry) => {
      if (entry.balls > 0 || entry.runs > 0) {
        if (!highestTotal || entry.runs > highestTotal.runs) {
          highestTotal = { team: entry.team, runs: entry.runs, wkts: entry.wkts };
        }
      }
    });

    const endCount = activeEvents.filter((e) => e.type === "endInnings").length;
    if (endCount >= 2 || m?.status === "complete") {
      completedMatches += 1;
      let resultText = "Tied match";
      if (inn1.runs > inn2.runs) {
        resultText = `${firstTeam} won by ${inn1.runs - inn2.runs} runs`;
      } else if (inn2.runs > inn1.runs) {
        const maxWkts = m?.config?.rules?.maxWickets ?? 10;
        resultText = `${secondTeam} won by ${Math.max(1, maxWkts - inn2.wkts)} wickets`;
      }
      recentResults.push(
        `${firstTeam} (${inn1.runs}/${inn1.wkts}) vs ${secondTeam} (${inn2.runs}/${inn2.wkts}) — ${resultText}`
      );
    } else if (activeEvents.length > 0) {
      recentResults.push(
        `${firstTeam} (${inn1.runs}/${inn1.wkts}) vs ${secondTeam} (${inn2.runs}/${inn2.wkts}) — In progress`
      );
    }
  });

  const oversDisplay = `${Math.floor(totalBalls / 6)}.${totalBalls % 6}`;
  const scoringRate = totalBalls > 0 ? ((totalRuns / totalBalls) * 6).toFixed(2) : "0.00";

  return {
    totalMatches: matches.length,
    completedMatches,
    totalRuns,
    totalWickets,
    totalSixes,
    totalFours,
    totalBalls,
    totalExtras,
    oversDisplay,
    scoringRate,
    highestTotal,
    recentResults,
  };
}

// ─── Offline / Fallback Verified Cricket Knowledge Engine ─────────────────────
function smartCricketResponse(message, context = {}) {
  const rawQuery = (message || "").toLowerCase();
  const query = rawQuery.replace(/-/g, " ");
  const { matches = [], stats = {}, profileName = "Gully scorer" } = context;
  const computed = computeMatchSummary(matches);

  // 1. Match stats & previous match results
  if (
    query.includes("stat") ||
    query.includes("score") ||
    query.includes("number") ||
    query.includes("how many") ||
    query.includes("record") ||
    query.includes("highest") ||
    query.includes("win") ||
    query.includes("won") ||
    query.includes("result") ||
    query.includes("previous") ||
    query.includes("match")
  ) {
    const runsDisplay = stats.runs ?? computed.totalRuns;
    const sixesDisplay = stats.sixes ?? computed.totalSixes;
    const foursDisplay = stats.fours ?? computed.totalFours;
    const wktsDisplay = stats.wkts ?? computed.totalWickets;
    const ballsDisplay = stats.balls ?? computed.totalBalls;
    const oversDisplay = `${Math.floor(ballsDisplay / 6)}.${ballsDisplay % 6}`;
    const rateDisplay = ballsDisplay > 0 ? ((runsDisplay / ballsDisplay) * 6).toFixed(2) : "0.00";
    const highestText = computed.highestTotal
      ? `${computed.highestTotal.runs}/${computed.highestTotal.wkts} (${computed.highestTotal.team})`
      : "None yet";

    let resultsSection = "";
    if (computed.recentResults.length > 0) {
      resultsSection =
        "\n\n🏆 **Recent Matches:**\n" +
        computed.recentResults
          .slice(0, 5)
          .map((r) => `• ${r}`)
          .join("\n");
    }

    return `📊 **Your Gully Numbers on This Device (${profileName}):**
• **Total Matches:** ${computed.totalMatches} (${computed.completedMatches} completed)
• **Runs Scored:** ${runsDisplay}
• **Sixes:** ${sixesDisplay} | **Fours:** ${foursDisplay}
• **Wickets Taken:** ${wktsDisplay}
• **Overs Bowled:** ${oversDisplay} overs
• **Highest Total:** ${highestText}
• **Scoring Rate:** ${rateDisplay} runs/over${resultsSection}

${computed.totalMatches > 0 ? "All stats update live with every ball you score!" : "Tap the cricket ball on Home or '+' in the sidebar to start your first match!"}`;
  }

  // 2. Gully cricket rules
  if (
    query.includes("gully") ||
    query.includes("street") ||
    query.includes("one tip") ||
    query.includes("one hand") ||
    query.includes("boundary") ||
    query.includes("wall") ||
    query.includes("tree") ||
    query.includes("baby over") ||
    query.includes("trial")
  ) {
    return `🏏 **Standard Gully Cricket Rules & Traditions:**

1. **One-Tip-One-Hand (Ek Tappa Ek Haath):**
   A batter is out if the ball bounces once and is caught cleanly in **one hand** without touching the body or another surface.

2. **Direct Boundary = OUT / Lost Ball:**
   Hitting directly over the fence, terrace wall, or into a house/drain is **OUT** — and the batter who hit it goes to fetch the ball!

3. **Trial Ball (First Ball):**
   The first ball faced by a new batter (or first ball of a match) can be agreed as a trial ball — no runs, no out.

4. **Baby Over:**
   A shorter 3-ball or 4-ball over used when fading light or extra bowlers need a turn.

5. **Wall / Obstacle Runs:**
   Shots hitting designated walls or gates count as 1, 2, or 4 runs depending on house rules.`;
  }

  // 3. LBW Rules
  if (query.includes("lbw") || query.includes("leg before")) {
    return `🛡️ **LBW (Leg Before Wicket) Explained:**

Under Law 36 of Cricket, a batter is out LBW when:
1. **Legal delivery** (not a No Ball).
2. **Pitching:** Ball pitches in line with the stumps or outside off-stump (never outside leg stump).
3. **Impact:** Ball hits pad/body in line with the stumps (or outside off if no shot was offered).
4. **Hitting Stumps:** Ball's path would have gone on to hit the stumps.

*Gully Cricket Tip:* LBW is usually turned **OFF** in gully cricket to avoid arguments!`;
  }

  // 4. Extras (Wide & No Ball)
  if (
    query.includes("wide") ||
    query.includes("no ball") ||
    query.includes("noball") ||
    query.includes("extra") ||
    query.includes("free hit")
  ) {
    return `⚡ **Extras & Illegal Deliveries in Gully Crix:**

• **Wide Ball:** Passes too wide of the batter's reach. Awards **+1 run** (configurable in Match Rules) and must be re-bowled if \`wideLegal\` is off.

• **No Ball:** Overstepping the crease or bowling above waist height. Awards **+1 run**, re-bowled, and triggers a **Free Hit** on the next delivery!

• **Free Hit:** On the ball right after a No Ball, the batter can only be dismissed via **Run Out**.

• **Byes & Leg Byes:** Extras scored when the ball misses the bat (Byes) or comes off the body/pad (Leg Byes).`;
  }

  // 5. Overs & Run Rate
  if (
    query.includes("run rate") ||
    query.includes("crr") ||
    query.includes("rrr") ||
    query.includes("nrr") ||
    query.includes("over") ||
    query.includes("wicket")
  ) {
    return `📈 **Overs, Wickets & Run Rate Guide:**

• **Current Run Rate (CRR):** Total Runs ÷ Overs Bowled
  *Example:* 45 runs in 5.0 overs = **9.00 runs/over**

• **Required Run Rate (RRR):** Runs Needed ÷ Remaining Overs
  *Example:* 30 runs needed off 3.0 overs = **10.00 RRR**

• **Net Run Rate (NRR):** (Runs Scored ÷ Overs Faced) − (Runs Conceded ÷ Overs Bowled)

• **Overs Notation:** 6 legal balls = 1 over. \`5.3\` overs means 5 completed overs and 3 balls (not 5.3 decimal).

• **Wickets:** Ways out include Bowled, Caught, Run Out, Stumped, Hit Wicket (and LBW in formal matches).`;
  }

  // 6. Default cricket help
  return `🏏 **Gully AI Cricket Assistant:**

I can help you with cricket rules, live match stats, and scoring! Try asking:
• **"Explain one-tip-one-hand"** or **"What are gully cricket rules?"**
• **"How is LBW judged?"**
• **"Show my match stats"** or **"Who won the last match?"**
• **"How do wides & no-balls score?"**
• **"How is Net Run Rate calculated?"**

What would you like to know?`;
}

// ─── Provider Detection (supports Groq, Gemini, xAI Grok, OpenAI) ────────────
function detectProviderConfig() {
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const grokKey = process.env.GROK_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();

  // Check explicit keys first, then auto-detect prefix if pasted under another name
  const candidates = [
    { env: "GROQ_API_KEY", key: groqKey, defaultProvider: "groq" },
    { env: "GEMINI_API_KEY", key: geminiKey, defaultProvider: "gemini" },
    { env: "GROK_API_KEY", key: grokKey, defaultProvider: "grok" },
    { env: "OPENAI_API_KEY", key: openaiKey, defaultProvider: "openai" },
  ].filter((c) => !!c.key && !c.key.startsWith("your_"));

  if (candidates.length === 0) return null;

  const picked = candidates[0];
  let provider = picked.defaultProvider;
  if (picked.key.startsWith("gsk_")) provider = "groq";
  else if (picked.key.startsWith("AIza")) provider = "gemini";
  else if (picked.key.startsWith("xai-")) provider = "grok";
  else if (picked.key.startsWith("sk-")) provider = "openai";

  return { provider, apiKey: picked.key, envName: picked.env };
}

function buildSystemPrompt(matchContext = {}) {
  const computed = computeMatchSummary(matchContext.matches || []);
  return `You are Gully AI, the friendly cricket umpire, scorer, and rules analyst for the GULLY CRIX app.

Your style:
- Expert on both international cricket laws (LBW, wides, no-balls, overs, wickets, CRR/RRR/NRR) and street/gully cricket customs (one-tip-one-hand, direct boundary out, trial ball, baby over, wall runs).
- Inspect and reference the user's real match data and stats on this device whenever asked.
- Format responses cleanly using **bold** and bullet points (avoid raw LaTeX like $$...$$). Keep answers concise and helpful.

User's current app state:
- Scorer Name: ${matchContext.profileName || "Gully scorer"}
- Current Screen: ${matchContext.currentPath || "/"}
- Total Matches: ${computed.totalMatches} (${computed.completedMatches} completed)
- Runs: ${computed.totalRuns}, Wickets: ${computed.totalWickets}, Sixes: ${computed.totalSixes}, Fours: ${computed.totalFours}, Extras: ${computed.totalExtras}, Overs: ${computed.oversDisplay}, Scoring Rate: ${computed.scoringRate}
- Highest Total: ${computed.highestTotal ? `${computed.highestTotal.runs}/${computed.highestTotal.wkts} (${computed.highestTotal.team})` : "None"}
- Recent Matches: ${computed.recentResults.length > 0 ? computed.recentResults.join(" | ") : "No completed matches yet"}`;
}

async function callOpenAICompatible({ endpoint, apiKey, model, systemPrompt, userMessage, history }) {
  const messages = [{ role: "system", content: systemPrompt }];
  if (Array.isArray(history)) {
    history.slice(-6).forEach((msg) => {
      if (msg.role && msg.text) {
        messages.push({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.text,
        });
      }
    });
  }
  messages.push({ role: "user", content: userMessage });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 600,
    }),
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const err = new Error(errorText);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try asking again!";
}

async function callGeminiAPI({ apiKey, systemPrompt, userMessage, history }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const contents = [];

  if (Array.isArray(history)) {
    history.slice(-6).forEach((msg) => {
      if (msg.role && msg.text) {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.text }],
        });
      }
    });
  }
  contents.push({ role: "user", parts: [{ text: userMessage }] });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 700 },
    }),
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const err = new Error(errorText);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response. Please try asking again!";
}

async function callLiveAI(providerCfg, userMessage, history, matchContext) {
  const systemPrompt = buildSystemPrompt(matchContext);

  if (providerCfg.provider === "groq") {
    return callOpenAICompatible({
      endpoint: "https://api.groq.com/openai/v1/chat/completions",
      apiKey: providerCfg.apiKey,
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      systemPrompt,
      userMessage,
      history,
    });
  }

  if (providerCfg.provider === "gemini") {
    return callGeminiAPI({
      apiKey: providerCfg.apiKey,
      systemPrompt,
      userMessage,
      history,
    });
  }

  if (providerCfg.provider === "openai") {
    return callOpenAICompatible({
      endpoint: "https://api.openai.com/v1/chat/completions",
      apiKey: providerCfg.apiKey,
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      systemPrompt,
      userMessage,
      history,
    });
  }

  // Default: xAI Grok
  return callOpenAICompatible({
    endpoint: "https://api.x.ai/v1/chat/completions",
    apiKey: providerCfg.apiKey,
    model: process.env.GROK_MODEL || "grok-3-mini",
    systemPrompt,
    userMessage,
    history,
  });
}

function formatFriendlyApiError(providerCfg, err) {
  const status = err?.status;
  const msg = String(err?.message || "");
  if (status === 403 || status === 402 || msg.includes("credits") || msg.includes("spending limit")) {
    return `⚠️ **API Credits Exhausted (${providerCfg.provider.toUpperCase()}):** Your ${providerCfg.envName} has no active credits or reached its spending limit. *(Tip: **Groq** at console.groq.com and **Google Gemini** at aistudio.google.com offer free API keys with no credit card!)*`;
  }
  if (status === 401 || msg.toLowerCase().includes("invalid api key")) {
    return `⚠️ **Invalid API Key:** Please double-check your \`${providerCfg.envName}\` in \`.env\` or Render Environment Variables.`;
  }
  if (status === 429) {
    return `⏳ **Rate Limit Reached:** Too many requests right now. Showing verified cricket guide below instead:`;
  }
  return `⚠️ **Live AI Offline:** Could not reach the ${providerCfg.provider.toUpperCase()} service right now. Showing verified cricket guide below:`;
}

// ─── Health check ─────────────────────────────────────────────────────────────
export function handleHealth(req, res) {
  const cfg = detectProviderConfig();
  const providerNames = {
    groq: "Groq (Llama 3.3)",
    gemini: "Google Gemini",
    grok: "xAI Grok",
    openai: "OpenAI",
  };
  res.json({
    status: "ok",
    appName: "GULLY CRIX",
    hasApiKey: !!cfg,
    aiProvider: cfg ? providerNames[cfg.provider] : "Offline Knowledge Base",
  });
}

app.get("/api/health", handleHealth);

// ─── Chat endpoint ────────────────────────────────────────────────────────────
export async function handleChat(req, res) {
  try {
    const { message, history = [], matchContext = {} } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message string is required." });
    }

    const providerCfg = detectProviderConfig();

    if (!providerCfg) {
      const smartAnswer = smartCricketResponse(message, matchContext);
      const honestDisclaimer =
        "⚠️ **No AI API Key Configured:** Add a free `GROQ_API_KEY` (console.groq.com) or `GEMINI_API_KEY` (aistudio.google.com) in `.env` or your host's Environment Variables for live AI.\n\n*(Answering using built-in Gully Crix cricket rules & your match data)*\n\n";

      return res.json({
        reply: honestDisclaimer + smartAnswer,
        isConfigured: false,
      });
    }

    try {
      const liveReply = await callLiveAI(providerCfg, message, history, matchContext);
      return res.json({ reply: liveReply, isConfigured: true, provider: providerCfg.provider });
    } catch (apiErr) {
      console.error(`${providerCfg.provider} API call failed:`, apiErr?.status || "", apiErr?.message);
      const fallback = smartCricketResponse(message, matchContext);
      const notice = formatFriendlyApiError(providerCfg, apiErr);
      return res.json({
        reply: `${notice}\n\n${fallback}`,
        isConfigured: false,
      });
    }
  } catch (err) {
    console.error("Server /api/chat error:", err);
    res.status(500).json({ error: "Internal server error in Gully AI." });
  }
}

app.post("/api/chat", handleChat);

// ─── Static frontend ──────────────────────────────────────────────────────────
const staticDir = path.join(rootDir, "public");
app.use(express.static(staticDir));

app.get("*", (req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    const cfg = detectProviderConfig();
    console.log(`🏏 GULLY CRIX Server running on http://localhost:${PORT}`);
    console.log(`🤖 Gully AI API ready at http://localhost:${PORT}/api/chat`);
    if (!cfg) {
      console.log(`ℹ️  No API key configured. Running in offline verified cricket mode.`);
    } else {
      console.log(`✅ ${cfg.envName} detected (provider: ${cfg.provider}).`);
    }
  });
}
