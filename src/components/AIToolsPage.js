
import React, { useMemo, useState } from "react";

const AIToolsPage = () => {
  const [activeTool, setActiveTool] = useState("summary");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const tools = useMemo(
    () => [
      {
        key: "summary",
        name: "Summary AI",
        emoji: "📝",
        blurb: "Turn walls of text into crystal‑clear takeaways.",
      },
      {
        key: "brainstorm",
        name: "Brainstorming AI",
        emoji: "💡",
        blurb: "Spark fresh ideas, angles, and concepts on demand.",
      },
      {
        key: "productivity",
        name: "Productivity Assistant",
        emoji: "⚙️",
        blurb: "Draft, polish, and automate busywork in seconds.",
      },
    ],
    []
  );

  const examplePrompts = useMemo(
    () => ({
      summary: [
        "Summarize this article into 5 bullet points:",
        "Create an executive summary of these meeting notes:",
        "Explain the key takeaways for a non‑technical audience:",
      ],
      brainstorm: [
        "Give 12 creative name ideas for a fitness app.",
        "List marketing angles for an eco‑friendly water bottle.",
        "Generate hook ideas for a 30s launch video.",
      ],
      productivity: [
        "Draft a polite follow‑up email asking for a project update.",
        "Create a 5‑step checklist for debugging front‑end performance.",
        "Rewrite this paragraph to be clearer and more concise:",
      ],
    }),
    []
  );

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput("");
    // Stubbed generation: replace with your API call if desired
    await new Promise((r) => setTimeout(r, 700));
    const heading =
      activeTool === "summary"
        ? "Summary"
        : activeTool === "brainstorm"
        ? "Ideas"
        : "Assistant";
    const sample =
      activeTool === "summary"
        ? [
            "• Key point 1 highlighting the core insight.",
            "• Key point 2 clarifying context and nuance.",
            "• Key point 3 with a practical implication.",
          ].join("\n")
        : activeTool === "brainstorm"
        ? [
            "1) Fresh angle that reframes the problem",
            "2) Bold, playful concept to test quickly",
            "3) Low‑lift variation for fast validation",
          ].join("\n")
        : [
            "• Drafted outline with clear next actions",
            "• Suggested phrasing to increase clarity",
            "• Quick checklist to avoid common pitfalls",
          ].join("\n");

    setOutput(`${heading} based on your prompt:\n\n${sample}\n\nPrompt:\n${prompt}`);
    setLoading(false);
  };

  const onPickExample = (text) => setPrompt((p) => (p ? `${p}\n\n${text}` : text));

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.badge}>New</div>
        <h1 style={styles.headline}>
          Your everyday work, supercharged with <span style={styles.gradient}>AI</span>
        </h1>
        <p style={styles.subhead}>
          Beautiful results with fewer clicks—summarize, ideate, and ship faster.
        </p>
        <p style={styles.intro}>
          This AI toolbox gives you three focused assistants. Pick one, paste a prompt,
          and generate high‑quality output tailored to your task.
        </p>
      </section>

      <section>
        <div style={styles.grid}>
          {tools.map((t) => {
            const isActive = t.key === activeTool;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTool(t.key)}
                style={{
                  ...styles.card,
                  ...(isActive ? styles.cardActive : {}),
                }}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.emoji}>{t.emoji}</span>
                  <span style={styles.cardTitle}>{t.name}</span>
                </div>
                <p style={styles.cardBlurb}>{t.blurb}</p>
                {isActive && <div style={styles.pill}>Selected</div>}
              </button>
            );
          })}
        </div>
      </section>

      <section style={styles.examples}>
        <h3 style={styles.sectionTitle}>Example prompts</h3>
        <div style={styles.chipsWrap}>
          {examplePrompts[activeTool].map((ex, i) => (
            <button key={i} onClick={() => onPickExample(ex)} style={styles.chip}>
              {ex}
            </button>
          ))}
        </div>
      </section>

      <section style={styles.toolbox}>
        <div style={styles.promptHeader}>
          <span style={styles.promptLabel}>
            {tools.find((t) => t.key === activeTool)?.name}
          </span>
          <span style={styles.helperText}>
            Tip: click an example to auto‑fill the box
          </span>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your task, paste text to summarize, or outline what you need…"
          rows={6}
          style={styles.textarea}
        />

        <div style={styles.actions}>
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            style={{
              ...styles.button,
              ...(loading || !prompt.trim() ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? "Generating…" : "Generate"}
          </button>
        </div>

        <div style={styles.outputWrap}>
          <div style={styles.outputHeader}>Output</div>
          <pre style={styles.output}>{output || "Your result will appear here…"}</pre>
        </div>
      </section>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "32px 20px 64px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    color: "#0b1220",
  },
  hero: {
    textAlign: "center",
    marginBottom: 28,
  },
  badge: {
    display: "inline-block",
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    background:
      "linear-gradient(135deg, rgba(99,102,241,.15), rgba(59,130,246,.15))",
    color: "#3730a3",
    border: "1px solid rgba(99,102,241,.35)",
    marginBottom: 10,
    fontWeight: 600,
  },
  headline: {
    fontSize: 40,
    lineHeight: 1.1,
    margin: "6px 0 8px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  gradient: {
    background:
      "linear-gradient(135deg, #6366f1 0%, #14b8a6 50%, #22c55e 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  },
  subhead: {
    fontSize: 18,
    color: "#475569",
    margin: "0 0 6px",
  },
  intro: {
    fontSize: 15,
    color: "#64748b",
    margin: "0 auto",
    maxWidth: 720,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 14,
    marginTop: 18,
  },
  card: {
    textAlign: "left",
    border: "1px solid #e5e7eb",
    background: "white",
    borderRadius: 14,
    padding: 16,
    cursor: "pointer",
    transition: "all .2s ease",
    boxShadow: "0 1px 2px rgba(16,24,40,.04)",
  },
  cardActive: {
    borderColor: "#a5b4fc",
    boxShadow: "0 6px 30px rgba(99,102,241,.16)",
    transform: "translateY(-1px)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  emoji: { fontSize: 22 },
  cardTitle: { fontWeight: 700, fontSize: 16 },
  cardBlurb: { margin: 0, color: "#6b7280", fontSize: 14 },
  pill: {
    marginTop: 10,
    display: "inline-block",
    fontSize: 12,
    padding: "4px 8px",
    borderRadius: 999,
    background: "rgba(99,102,241,.08)",
    color: "#3730a3",
    border: "1px solid rgba(99,102,241,.25)",
    fontWeight: 600,
  },
  examples: { marginTop: 24 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#334155",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: ".08em",
  },
  chipsWrap: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    cursor: "pointer",
    fontSize: 13,
    color: "#0f172a",
  },
  toolbox: {
    marginTop: 20,
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 16,
    background: "linear-gradient(180deg, #ffffff, #fafafa)",
  },
  promptHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  promptLabel: { fontWeight: 700, fontSize: 16 },
  helperText: { fontSize: 12, color: "#64748b" },
  textarea: {
    width: "100%",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    padding: 12,
    fontSize: 14,
    resize: "vertical",
    outline: "none",
  },
  actions: { marginTop: 10, display: "flex", gap: 10, justifyContent: "flex-end" },
  button: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #4f46e5",
    background:
      "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  outputWrap: {
    marginTop: 14,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    background: "#ffffff",
  },
  outputHeader: {
    padding: "10px 12px",
    borderBottom: "1px solid #e5e7eb",
    fontWeight: 700,
    fontSize: 13,
    color: "#334155",
  },
  output: {
    margin: 0,
    padding: 12,
    whiteSpace: "pre-wrap",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 13,
    color: "#0f172a",
    minHeight: 90,
  },
};

export default AIToolsPage;
