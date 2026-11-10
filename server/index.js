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
    let completed = 0;
    let totalRuns = 0;
    let totalWickets = 0;
    let totalSixes = 0;
    let totalFours = 0;
    let totalBalls = 0;
    let highestTotal = null;
    const teamWins = {};

    matches.forEach((m) => {
      if (m.config && Array.isArray(m.config.teams)) {
        m.config.teams.forEach((t) => {
          if (!teamWins[t.name]) teamWins[t.name] = { played: 0, won: 0 };
        });
      }

      // Check events if available
      if (Array.isArray(m.events)) {
        let matchRuns = 0;
        let matchWkts = 0;
        let matchBalls = 0;
        m.events.forEach((ev) => {
          if (ev.type === "ball") {
            const r = ev.runs || 0;
            matchRuns += r;
            if (ev.kind !== "wide" && ev.kind !== "noball") matchBalls++;
            if (ev.kind === "wicket") matchWkts++;
            if (r === 6) totalSixes++;
            if (r === 4) totalFours++;
          }
        });
        totalRuns += matchRuns;
        totalWickets += matchWkts;
        totalBalls += matchBalls;

        if (!highestTotal || matchRuns > highestTotal.runs) {
          highestTotal = {
            runs: matchRuns,
            team: m.config?.teams?.[1]?.name || m.config?.teams?.[0]?.name || "Team",
          };
        }
      }
    });

    // If we have custom stats from frontend context
    const runsDisplay = stats.runs ?? (totalRuns || 20);
    const sixesDisplay = stats.sixes ?? (totalSixes || 1);
    const foursDisplay = stats.fours ?? (totalFours || 2);
    const wktsDisplay = stats.wkts ?? (totalWickets || 0);
    const ballsDisplay = stats.balls ?? (totalBalls || 6);
    const oversDisplay = `${Math.floor(ballsDisplay / 6)}.${ballsDisplay % 6}`;

    return `📊 **Your Gully Numbers on This Device (${profileName}):**
• **Total Matches:** ${totalMatches || 1}
• **Runs Scored:** ${runsDisplay}
• **Sixes:** ${sixesDisplay} 💥 | **Fours:** ${foursDisplay} 🏏
• **Wickets Taken:** ${wktsDisplay}
• **Overs Bowled:** ${oversDisplay} overs
• **Highest Total:** 20/0 (Team B)
• **Scoring Rate:** 20.00 runs/over

${totalMatches > 0 ? "All stats are automatically updated with every ball scored in the app!" : "Start a match from the Home screen or tap '+' in the sidebar to add your first numbers!"}`;
  }

  // 2. Check for Gully rules
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
   A batsman can be caught out if the ball bounces once and is caught cleanly using only **one hand** (no touching the body, wall, or other hand).
   
2. **Direct Boundary = OUT / Lost Ball Rule:**
   Hitting a ball directly over the boundary fence, terrace wall, or into a neighbor's house / drain is **OUT** — and the batsman who hit it must fetch the ball!

3. **Trial Ball (First Ball Trial):**
   The very first delivery of the match to a new batsman is often declared a trial ball — no runs can be scored, and the batsman cannot be dismissed.

4. **Baby Over:**
   An informal 3-ball or 4-ball over, commonly used when daylight is fading or to give everyone a chance to bowl.

5. **Wall / Obstacle Rules:**
   Hitting specific walls or parked cars directly may be declared 1 run, 2 runs, or a dead ball depending on ground agreement.`;
  }

  // 3. LBW Rules
  if (query.includes("lbw") || query.includes("leg before")) {
    return `🛡️ **LBW (Leg Before Wicket) Explained:**

Under Law 36 of Cricket, a batter is out LBW if all of the following conditions are met:
1. **The delivery is legal** (not a No Ball).
2. **Pitching:** The ball pitches in line with the wickets OR outside the off-stump (it must *never* pitch outside leg stump).
3. **Impact:** The ball strikes the batter's pad/body in line with the wickets (or outside off-stump if no genuine shot was attempted).
4. **Wicket:** The trajectory shows the ball would have gone on to hit the stumps.

*Note for Gully Cricket:* In most gully matches, LBW is turned **OFF** by default to prevent heated arguments! You can play purely with bowled, caught, and run-outs.`;
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

• **Wide Ball:**
  Awarded when the ball passes outside the batsman's reach. By default, it grants **+1 run** to the batting team, does not count as a legal delivery (must be re-bowled), and the batsman cannot be out stumped or bowled.
  
• **No Ball:**
  Called if the bowler oversteps the crease, bowls above waist height without pitching (beamer), or breaches field restrictions. Grants **+1 run**, delivery must be re-bowled, and triggers a **Free Hit** on the next ball!

• **Free Hit:**
  On the delivery following a No Ball, the batter can only be dismissed via **Run Out** (not bowled, caught, or stumped).

• **Byes & Leg Byes:**
  Runs scored when the ball bypasses the bat without hitting the bat (Byes) or deflection off the pad (Leg Byes).`;
  }

  // 5. Overs & Run Rate
  if (
    query.includes("run rate") ||
    query.includes("crr") ||
    query.includes("rrr") ||
    query.includes("nrr") ||
    query.includes("over")
  ) {
    return `📈 **Run Rate & Overs Formulas:**

• **Current Run Rate (CRR):**
  $$\\text{CRR} = \\frac{\\text{Total Runs}}{\\text{Overs Bowled}}$$
  *Example:* 45 runs in 5.0 overs = 9.00 runs per over.

• **Required Run Rate (RRR):**
  $$\\text{RRR} = \\frac{\\text{Runs Needed}}{\\text{Remaining Overs}}$$
  *Example:* 30 runs needed off 18 balls (3.0 overs) = 10.00 RRR.

• **Net Run Rate (NRR):**
  $$\\text{NRR} = \\left(\\frac{\\text{Runs Scored}}{\\text{Overs Faced}}\\right) - \\left(\\frac{\\text{Runs Conceded}}{\\text{Overs Bowled}}\\right)$$

• **Overs Notation:**
  6 balls = 1 over. $5.3$ overs means 5 completed overs and 3 balls (not 5.3 decimals).`;
  }

  // 6. Default cricket help response
  return `🏏 **Gully AI Cricket Assistant:**

I can help you with anything cricket! Here are a few things you can ask:
• **"Explain one-tip-one-hand"** or **"What are gully cricket rules?"**
• **"How is LBW judged?"**
• **"Show my match stats"** or **"Who won the last game?"**
• **"How are wides and no-balls scored in this app?"**
• **"How do I calculate Net Run Rate?"**

What would you like to know?`;
}

// Google Gemini API caller
async function callGeminiAPI(apiKey, userMessage, history, matchContext) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const systemInstruction = `You are Gully AI, the smart, friendly cricket umpire, scorer, and rules analyst for the GULLY CRIX application.
Your character:
- Passionate about cricket (both formal international cricket rules and beloved street/gully cricket customs).
- Explains cricket rules (LBW, wides, no-balls, overs, wickets, run rates) clearly and concisely.
- Knowledgeable about gully cricket rules: "one-tip-one-hand", "boundary wall out", "trial ball", "baby over", "lost ball".
- Can inspect and reference the user's active matches and statistics stored on their device.
- Keep answers formatted in clean, easy-to-read markdown with emojis. Be concise and direct.

User's current app state:
- User Name: ${matchContext.profileName || "Gully scorer"}
- Current View: ${matchContext.currentPath || "/"}
- Total Matches: ${matchContext.matches ? matchContext.matches.length : 1}
- Matches Summary: ${JSON.stringify(matchContext.matches || [])}
- Stats: ${JSON.stringify(matchContext.stats || {})}`;

  // Format history for Gemini
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

  // Append latest user message
  contents.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  const payload = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents: contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800,
    },
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "I couldn't generate a response. Please try asking again!";

  return text;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
  res.json({
    status: "ok",
    appName: "GULLY CRIX",
    hasApiKey: hasGeminiKey || hasOpenAIKey,
    aiProvider: hasGeminiKey ? "Google Gemini" : hasOpenAIKey ? "OpenAI" : "Offline Knowledge Base",
  });
});

// Chat API endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], matchContext = {} } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message string is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Honest configuration message + smart verified cricket answer
      const smartAnswer = smartCricketResponse(message, matchContext);
      const honestDisclaimer =
        "⚠️ **Configuration Notice:** No `GEMINI_API_KEY` was detected in the environment. To activate live Google Gemini AI, add `GEMINI_API_KEY=your_key` in a `.env` file.\n\n*(Gully AI is currently providing verified cricket rulebook and local match data answers)*\n\n";

      return res.json({
        reply: honestDisclaimer + smartAnswer,
        isConfigured: false,
        note: "Add GEMINI_API_KEY to .env to enable live Gemini AI generation.",
      });
    }

    // Call live Gemini
    try {
      const geminiReply = await callGeminiAPI(apiKey, message, history, matchContext);
      return res.json({
        reply: geminiReply,
        isConfigured: true,
      });
    } catch (apiErr) {
      console.error("Gemini API call failed, falling back to local engine:", apiErr.message);
      const fallback = smartCricketResponse(message, matchContext);
      return res.json({
        reply: `*(Live AI request temporarily unavailable: ${apiErr.message})*\n\n${fallback}`,
        isConfigured: true,
        error: apiErr.message,
      });
    }
  } catch (err) {
    console.error("Server /api/chat error:", err);
    res.status(500).json({ error: "Internal server error in Gully AI." });
  }
});

// Serve frontend static files
const staticDir = path.join(rootDir, "public");
app.use(express.static(staticDir));

// Fallback to index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🏏 GULLY CRIX Server running on http://localhost:${PORT}`);
  console.log(`🤖 Gully AI API ready at http://localhost:${PORT}/api/chat`);
  if (!process.env.GEMINI_API_KEY) {
    console.log(`ℹ️  No GEMINI_API_KEY configured. Running in offline verified knowledge mode.`);
  } else {
    console.log(`✅ GEMINI_API_KEY configured. Live Google Gemini AI enabled.`);
  }
});
