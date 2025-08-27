import React, { useMemo, useState } from "react";

const AIToolsPage = () => {
  const [activeTool, setActiveTool] = useState("summary");

  const tools = useMemo(
    () => [
      {
        key: "summary",
        name: "Summary AI",
        emoji: "📝",
        blurb: "Turn walls of text into crystal-clear takeaways.",
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
        "Explain the key takeaways for a non-technical audience:",
      ],
      brainstorm: [
        "Give 12 creative name ideas for a fitness app.",
        "List marketing angles for an eco-friendly water bottle.",
        "Generate hook ideas for a 30s launch video.",
      ],
      productivity: [
        "Draft a polite follow-up email asking for a project update.",
        "Create a 5-step checklist for debugging front-end performance.",
        "Rewrite this paragraph to be clearer and more concise:",
      ],
    }),
    []
  );

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.badge}>New</div>
        <h1 style={styles.headline}>
          Your everyday work, supercharged with{" "}
          <span style={styles.gradient}>AI</span>
        </h1>
        <p style={styles.subhead}>
          Beautiful results with fewer clicks—summarize, ideate, and ship faster.
        </p>
        <p style={styles.intro}>
          This AI toolbox gives you three focused assistants. Pick one, and explore example prompts to see what it can do.
        </p>
      </section>

      {/* Tools Selector */}
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

      {/* Example Prompts */}
      <section style={styles.examples}>
        <h3 style={styles.sectionTitle}>Example prompts</h3>
        <div style={styles.chipsWrap}>
          {examplePrompts[activeTool]?.map((ex, i) => (
            <div key={i} style={styles.chip}>
              {ex}
            </div>
          ))}
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
    fontSize: 13,
    color: "#0f172a",
  },
};

export default AIToolsPage;
