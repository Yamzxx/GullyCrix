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

// Cricket Smart Rule & Match Engine for offline / fallback mode
function smartCricketResponse(message, context = {}) {
  const rawQuery = (message || "").toLowerCase();
  const query = rawQuery.replace(/-/g, " ");
  const { matches = [], stats = {}, profileName = "Gully scorer", currentPath = "" } = context;

  // 1. Check for stats / match history queries
  if (
    query.includes("stat") ||
    query.includes("score") ||
    query.includes("number") ||
    query.includes("how many") ||
    query.includes("record") ||
    query.includes("highest") ||
    query.includes("win") ||
    query.includes("won")
  ) {
    const totalMatches = matches.length;
    let totalRuns = 0;
    let totalWickets = 0;
    let totalSixes = 0;
    let totalFours = 0;
    let totalBalls = 0;

    matches.forEach((m) => {
      if (Array.isArray(m.events)) {
        m.events.forEach((ev) => {
          if (ev.type === "ball") {
            const r = ev.runs || 0;
            totalRuns += r;
            if (ev.kind !== "wide" && ev.kind !== "noball") totalBalls++;
            if (ev.kind === "wicket") totalWickets++;
            if (r === 6) totalSixes++;
            if (r === 4) totalFours++;
          }
        });
      }
    });

    const runsDisplay = stats.runs ?? totalRuns;
    const sixesDisplay = stats.sixes ?? totalSixes;
    const foursDisplay = stats.fours ?? totalFours;
    const wktsDisplay = stats.wkts ?? totalWickets;
    const ballsDisplay = stats.balls ?? totalBalls;
    const oversDisplay = `${Math.floor(ballsDisplay / 6)}.${ballsDisplay % 6}`;

    return `📊 **Your Gully Numbers on This Device (${profileName}):**
• **Total Matches:** ${totalMatches}
• **Runs Scored:** ${runsDisplay}
• **Sixes:** ${sixesDisplay} 💥 | **Fours:** ${foursDisplay} 🏏
• **Wickets Taken:** ${wktsDisplay}
• **Overs Bowled:** ${oversDisplay} overs

${totalMatches > 0 ? "All stats are automatically updated with every ball scored in the app!" : "Start a match from the Home screen or tap '+' to add your first numbers!"}`;
  }

  // 2. Gully rules
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
   A batsman can be caught out if the ball bounces once and is caught cleanly using only **one hand**.

2. **Direct Boundary = OUT / Lost Ball Rule:**
   Hitting the ball directly over the boundary fence, terrace wall, or into a drain is **OUT** — and the batsman must fetch the ball!

3. **Trial Ball (First Ball Trial):**
   The very first delivery to a new batsman is a trial ball — no runs scored, cannot be dismissed.

4. **Baby Over:**
   An informal 3-ball or 4-ball over, used when daylight fades or to give everyone a chance to bowl.

5. **Wall / Obstacle Rules:**
   Hitting specific walls or parked cars may be 1 run, 2 runs, or dead ball — decided by ground agreement.`;
  }

  // 3. LBW
  if (query.includes("lbw") || query.includes("leg before")) {
    return `🛡️ **LBW (Leg Before Wicket) Explained:**

Under Law 36 of Cricket, a batter is out LBW if:
1. **The delivery is legal** (not a No Ball).
2. **Pitching:** Ball pitches in line with the wickets or outside off-stump (never outside leg stump).
3. **Impact:** Ball strikes the pad in line with the wickets.
4. **Trajectory:** Ball would have gone on to hit the stumps.

*Note for Gully Cricket:* LBW is turned **OFF** by default in GULLY CRIX to prevent arguments. Play purely with bowled, caught, and run-outs!`;
  }

  // 4. Extras
  if (
    query.includes("wide") ||
    query.includes("no ball") ||
    query.includes("noball") ||
    query.includes("extra") ||
    query.includes("free hit")
  ) {
    return `⚡ **Extras & Illegal Deliveries in Gully Crix:**

• **Wide Ball:** Grants +1 run, doesn't count as a legal delivery, must be re-bowled.

• **No Ball:** Overstep or above-waist beamer. Grants +1 run, delivery re-bowled, triggers a **Free Hit** next ball!

• **Free Hit:** On the delivery after a No Ball, the batter can only be dismissed via **Run Out**.

• **Byes & Leg Byes:** Runs scored without the ball touching the bat (Byes) or deflecting off the pad (Leg Byes).`;
  }

  // 5. Run Rate / Overs
  if (
    query.includes("run rate") ||
    query.includes("crr") ||
    query.includes("rrr") ||
    query.includes("nrr") ||
    query.includes("over")
  ) {
    return `📈 **Run Rate & Overs Formulas:**

• **Current Run Rate (CRR):** Runs ÷ Overs Bowled
  *Example:* 45 runs in 5.0 overs = **9.00 runs/over**

• **Required Run Rate (RRR):** Runs Needed ÷ Remaining Overs
  *Example:* 30 runs needed in 3.0 overs = **10.00 RRR**

• **Net Run Rate (NRR):** (Runs Scored / Overs Faced) − (Runs Conceded / Overs Bowled)

• **Overs Notation:** 6 balls = 1 over. "5.3 overs" means 5 complete overs and 3 balls.`;
  }

  // 6. Default
  return `🏏 **Gully AI Cricket Assistant:**

I can help you with anything cricket! Try asking:
• **"Explain one-tip-one-hand"** or **"Gully cricket rules"**
• **"How is LBW judged?"**
• **"Show my match stats"** or **"Who won the last game?"**
• **"How are wides and no-balls scored?"**
• **"How do I calculate Net Run Rate?"**

What would you like to know?`;
}

// ─── Grok (xAI) API caller ───────────────────────────────────────────────────
// Grok uses an OpenAI-compatible REST API at api.x.ai
async function callGrokAPI(apiKey, userMessage, history, matchContext) {
  const endpoint = "https://api.x.ai/v1/chat/completions";

  const systemPrompt = `You are Gully AI, the smart, friendly cricket umpire, scorer, and rules analyst for the GULLY CRIX application.

Your character:
- Passionate about cricket (both formal international cricket rules and beloved street/gully cricket customs).
- Explains cricket rules (LBW, wides, no-balls, overs, wickets, run rates) clearly and concisely.
- Knowledgeable about gully cricket rules: "one-tip-one-hand", "boundary wall out", "trial ball", "baby over", "lost ball".
- Can inspect and reference the user's active matches and statistics stored on their device.
- Keep answers formatted in clean, easy-to-read markdown with emojis. Be concise and direct. Max 300 words.

User's current app state:
- User Name: ${matchContext.profileName || "Gully scorer"}
- Current View: ${matchContext.currentPath || "/"}
- Total Matches: ${matchContext.matches ? matchContext.matches.length : 0}
- Stats: Runs=${matchContext.stats?.runs ?? 0}, Sixes=${matchContext.stats?.sixes ?? 0}, Fours=${matchContext.stats?.fours ?? 0}, Wickets=${matchContext.stats?.wkts ?? 0}`;

  // Build messages array in OpenAI format
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
      model: "grok-3-mini",   // free-tier model — fast & great for cricket Q&A
      messages,
      temperature: 0.7,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Grok API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text =
    data.choices?.[0]?.message?.content ||
    "I couldn't generate a response. Please try asking again!";

  return text;
}

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  const hasGrokKey = !!process.env.GROK_API_KEY;
  res.json({
    status: "ok",
    appName: "GULLY CRIX",
    hasApiKey: hasGrokKey,
    aiProvider: hasGrokKey ? "xAI Grok" : "Offline Knowledge Base",
  });
});

// ─── Chat endpoint ────────────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], matchContext = {} } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message string is required." });
    }

    const apiKey = process.env.GROK_API_KEY;

    if (!apiKey) {
      // Honest offline mode — still gives real cricket answers
      const smartAnswer = smartCricketResponse(message, matchContext);
      const honestDisclaimer =
        "⚠️ **Configuration Notice:** No `GROK_API_KEY` found. To activate live Grok AI, add your key to the `.env` file.\n\n*(Providing verified cricket rulebook answers)*\n\n";

      return res.json({
        reply: honestDisclaimer + smartAnswer,
        isConfigured: false,
        note: "Add GROK_API_KEY=your_key to .env to enable live Grok AI.",
      });
    }

    // Call live Grok
    try {
      const grokReply = await callGrokAPI(apiKey, message, history, matchContext);
      return res.json({ reply: grokReply, isConfigured: true });
    } catch (apiErr) {
      console.error("Grok API call failed, falling back to local engine:", apiErr.message);
      const fallback = smartCricketResponse(message, matchContext);
      return res.json({
        reply: `*(Live AI temporarily unavailable: ${apiErr.message})*\n\n${fallback}`,
        isConfigured: true,
        error: apiErr.message,
      });
    }
  } catch (err) {
    console.error("Server /api/chat error:", err);
    res.status(500).json({ error: "Internal server error in Gully AI." });
  }
});

// ─── Static frontend ──────────────────────────────────────────────────────────
const staticDir = path.join(rootDir, "public");
app.use(express.static(staticDir));

app.get("*", (req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🏏 GULLY CRIX Server running on http://localhost:${PORT}`);
  console.log(`🤖 Gully AI API ready at http://localhost:${PORT}/api/chat`);
  if (!process.env.GROK_API_KEY) {
    console.log(`ℹ️  No GROK_API_KEY configured. Running in offline mode.`);
    console.log(`   → Get a free key at: https://console.x.ai/`);
  } else {
    console.log(`✅ GROK_API_KEY configured. Live xAI Grok AI enabled!`);
  }
});
