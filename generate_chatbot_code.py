# Python script to build the GullyAIChatbot component and bundle integration

chatbot_code = '''
// --- GULLY AI CHATBOT COMPONENT ---
function GullyAIChatbot({ isMatch, currentPath }) {
  const { matches, settings } = Mn();
  const [isOpen, setIsOpen] = z.useState(false);
  const [input, setInput] = z.useState("");
  const [loading, setLoading] = z.useState(false);
  const [errorMsg, setErrorMsg] = z.useState(null);
  const [messages, setMessages] = z.useState([
    {
      id: "welcome",
      role: "assistant",
      text: "🏏 **Welcome to Gully AI!**\\n\\nI'm your official cricket umpire, scorer, and rules analyst for **GULLY CRIX**.\\n\\nFeel free to ask me about:\\n• **Gully rules** (one-tip-one-hand, boundary-out, baby overs)\\n• **Official cricket rules** (LBW, wides, no-balls, overs, run rates)\\n• **Your match statistics** and previous match results on this device!\\n\\nWhat would you like to know?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const messagesEndRef = z.useRef(null);

  z.useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (textToSend) => {
    const text = (typeof textToSend === "string" ? textToSend : input).trim();
    if (!text || loading) return;

    const userMsg = {
      id: "user-" + Date.now(),
      role: "user",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setErrorMsg(null);

    // Compute stats summary for context
    let totalRuns = 0, totalWkts = 0, totalBalls = 0, totalSixes = 0, totalFours = 0;
    matches.forEach(m => {
      if (Array.isArray(m.events)) {
        m.events.forEach(ev => {
          if (ev.type === "ball") {
            totalRuns += ev.runs || 0;
            if (ev.kind !== "wide" && ev.kind !== "noball") totalBalls++;
            if (ev.kind === "wicket") totalWkts++;
            if (ev.runs === 6) totalSixes++;
            if (ev.runs === 4) totalFours++;
          }
        });
      }
    });

    const matchContext = {
      profileName: settings?.name || "Gully scorer",
      currentPath: currentPath || window.location.pathname,
      matches: matches,
      stats: {
        runs: totalRuns,
        wkts: totalWkts,
        balls: totalBalls,
        sixes: totalSixes,
        fours: totalFours,
        matchCount: matches.length
      }
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6),
          matchContext
        })
      });

      if (!res.ok) {
        throw new Error("Server responded with code " + res.status);
      }

      const data = await res.json();
      const assistantMsg = {
        id: "bot-" + Date.now(),
        role: "assistant",
        text: data.reply || "I didn't catch that. Could you ask again?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Gully AI request error:", err);
      setErrorMsg("Could not connect to Gully AI. Please ensure the server is running.");
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "assistant",
          text: "⚠️ **Connection Error:** Could not reach the Gully AI service. Make sure the local server is running on port 5000.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "🏏 Explain Gully Rules",
    "📊 What are my match numbers?",
    "⚡ How do wides & no-balls score?",
    "📈 How is Net Run Rate calculated?"
  ];

  return h.jsxs("div", {
    className: "gully-ai-root",
    children: [
      // Floating circular button
      h.jsxs("button", {
        onClick: () => setIsOpen(!isOpen),
        className: Rt(
          "press fixed z-50 h-14 w-14 rounded-full bg-[#102B17] text-[#F8F5E8] shadow-[0_10px_25px_-5px_rgba(11,28,16,.6)] ring-4 ring-[#F8F5E8] flex items-center justify-center transition-all duration-200",
          isMatch ? "bottom-4 right-4" : "bottom-24 md:bottom-6 right-5 md:right-6",
          isOpen && "rotate-90 scale-90"
        ),
        "aria-label": "Toggle Gully AI Chatbot",
        "title": "Gully AI Cricket Assistant",
        children: [
          // SVG Cricket / AI Icon
          h.jsxs("svg", {
            viewBox: "0 0 24 24",
            className: "h-7 w-7",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
              h.jsx("circle", { cx: "12", cy: "12", r: "9", stroke: "#F5C451" }),
              h.jsx("path", { d: "M7.5 7.5 C 10 10, 10 14, 7.5 16.5", stroke: "#F8F5E8", strokeWidth: "1.5" }),
              h.jsx("path", { d: "M16.5 7.5 C 14 10, 14 14, 16.5 16.5", stroke: "#F8F5E8", strokeWidth: "1.5" }),
              h.jsx("circle", { cx: "12", cy: "12", r: "1.5", fill: "#F5C451", stroke: "none" })
            ]
          }),
          // Small yellow AI badge
          !isOpen && h.jsx("span", {
            className: "absolute -top-1 -right-1 h-5 px-1.5 rounded-full bg-[#F5C451] text-[#0B1C10] font-black text-[10px] grid place-items-center ring-2 ring-[#102B17]",
            children: "AI"
          })
        ]
      }),

      // Backdrop overlay on mobile when open
      isOpen && h.jsx("div", {
        onClick: () => setIsOpen(false),
        className: "fixed inset-0 z-40 bg-[#0B1C10]/40 backdrop-blur-[1px] md:hidden"
      }),

      // Sliding chat drawer panel from the right
      h.jsxs("aside", {
        className: Rt(
          "fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[410px] max-w-full bg-[#F8F5E8] shadow-[-12px_0_35px_rgba(11,28,16,.3)] flex flex-col transition-transform duration-300 ease-out border-l border-[#0B1C10]/10",
          isOpen ? "translate-x-0" : "translate-x-full"
        ),
        "aria-label": "Gully AI Panel",
        children: [
          // Header
          h.jsxs("div", {
            className: "bg-[#102B17] text-[#F8F5E8] px-5 py-4 flex items-center justify-between border-b border-[#0B1C10]",
            children: [
              h.jsxs("div", {
                className: "flex items-center gap-3",
                children: [
                  h.jsx("div", {
                    className: "h-9 w-9 rounded-full bg-[#F5C451] text-[#0B1C10] grid place-items-center font-black text-xs shadow",
                    children: "AI"
                  }),
                  h.jsxs("div", {
                    children: [
                      h.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          h.jsx("h2", {
                            className: "text-lg font-black tracking-tight",
                            children: "Gully AI"
                          }),
                          h.jsx("span", {
                            className: "h-2 w-2 rounded-full bg-[#4CAF50] animate-pulse"
                          })
                        ]
                      }),
                      h.jsx("p", {
                        className: "text-[11px] text-[#F5C451] font-semibold tracking-wide uppercase",
                        children: "Cricket Rules & Analyst"
                      })
                    ]
                  })
                ]
              }),
              h.jsx("button", {
                onClick: () => setIsOpen(false),
                className: "press h-9 w-9 rounded-full bg-[#F8F5E8]/10 hover:bg-[#F8F5E8]/20 grid place-items-center text-[#F8F5E8]",
                "aria-label": "Close Gully AI",
                children: h.jsx("svg", {
                  viewBox: "0 0 24 24",
                  className: "h-5 w-5",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2.5",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    h.jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                    h.jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                  ]
                })
              })
            ]
          }),

          // Messages list
          h.jsxs("div", {
            className: "flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F8F5E8]",
            children: [
              messages.map((m) =>
                h.jsxs("div", {
                  key: m.id,
                  className: Rt(
                    "flex flex-col max-w-[88%]",
                    m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  ),
                  children: [
                    h.jsx("div", {
                      className: Rt(
                        "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
                        m.role === "user"
                          ? "bg-[#102B17] text-[#F8F5E8] rounded-tr-sm"
                          : "bg-[#FBF9F0] text-[#0B1C10] border border-[#0B1C10]/10 rounded-tl-sm"
                      ),
                      children: m.text
                    }),
                    h.jsx("span", {
                      className: "text-[10px] text-[#0B1C10]/40 mt-1 px-1 font-medium",
                      children: m.time
                    })
                  ]
                })
              ),

              // Typing indicator
              loading && h.jsxs("div", {
                className: "flex items-center gap-1.5 p-3 rounded-2xl bg-[#FBF9F0] border border-[#0B1C10]/10 w-fit",
                children: [
                  h.jsx("span", { className: "h-2 w-2 rounded-full bg-[#4CAF50] animate-bounce", style: { animationDelay: "0ms" } }),
                  h.jsx("span", { className: "h-2 w-2 rounded-full bg-[#4CAF50] animate-bounce", style: { animationDelay: "150ms" } }),
                  h.jsx("span", { className: "h-2 w-2 rounded-full bg-[#4CAF50] animate-bounce", style: { animationDelay: "300ms" } }),
                  h.jsx("span", { className: "text-xs font-semibold text-[#0B1C10]/60 ml-1.5", children: "Gully AI is thinking..." })
                ]
              }),

              // Quick question chips when chat has few messages
              messages.length <= 2 && h.jsxs("div", {
                className: "pt-2",
                children: [
                  h.jsx("p", {
                    className: "text-xs font-bold text-[#0B1C10]/50 uppercase tracking-wider mb-2",
                    children: "Suggested Topics:"
                  }),
                  h.jsx("div", {
                    className: "flex flex-wrap gap-1.5",
                    children: quickQuestions.map((q) =>
                      h.jsx("button", {
                        key: q,
                        onClick: () => handleSend(q),
                        className: "press text-xs font-semibold px-3 py-1.5 rounded-full bg-[#102B17]/6 hover:bg-[#102B17]/12 text-[#0B1C10] border border-[#0B1C10]/10 text-left transition-colors",
                        children: q
                      })
                    )
                  })
                ]
              }),

              h.jsx("div", { ref: messagesEndRef })
            ]
          }),

          // Error banner if any
          errorMsg && h.jsxs("div", {
            className: "mx-4 mb-2 p-2.5 rounded-xl bg-[#E52525]/10 border border-[#E52525]/20 text-[#E52525] text-xs font-semibold flex items-center justify-between",
            children: [
              h.jsx("span", { children: errorMsg }),
              h.jsx("button", {
                onClick: () => setErrorMsg(null),
                className: "underline font-bold text-[10px]",
                children: "Dismiss"
              })
            ]
          }),

          // Input form
          h.jsxs("form", {
            onSubmit: (e) => {
              e.preventDefault();
              handleSend();
            },
            className: "p-3 bg-[#FBF9F0] border-t border-[#0B1C10]/10 flex items-center gap-2",
            children: [
              h.jsx("input", {
                type: "text",
                value: input,
                onChange: (e) => setInput(e.target.value),
                placeholder: "Ask cricket rules, stats, or scoring...",
                disabled: loading,
                className: "flex-1 h-11 bg-[#F8F5E8] border border-[#0B1C10]/15 rounded-2xl px-4 text-sm text-[#0B1C10] placeholder-[#0B1C10]/40 outline-none focus:ring-2 focus:ring-[#4CAF50] disabled:opacity-50",
                "aria-label": "Message Gully AI"
              }),
              h.jsx("button", {
                type: "submit",
                disabled: !input.trim() || loading,
                className: "press h-11 w-11 rounded-2xl bg-[#F5C451] text-[#0B1C10] grid place-items-center font-bold hover:brightness-105 active:scale-95 disabled:opacity-40 shrink-0",
                "aria-label": "Send message",
                children: h.jsx("svg", {
                  viewBox: "0 0 24 24",
                  className: "h-5 w-5",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2.5",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    h.jsx("line", { x1: "22", y1: "2", x2: "11", y2: "13" }),
                    h.jsx("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })
                  ]
                })
              })
            ]
          })
        ]
      })
    ]
  });
}
'''
print("Chatbot code is ready to embed!")

