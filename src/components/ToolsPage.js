import React from "react";

const ToolsPage = () => {
  const tools = [
    {
      key: "summary",
      name: "Summary AI",
      emoji: "📝",
      blurb: "Turn walls of text into crystal-clear takeaways.",
      image: "https://via.placeholder.com/300x200?text=Summary+AI",
    },
    {
      key: "brainstorm",
      name: "Brainstorming AI",
      emoji: "💡",
      blurb: "Spark fresh ideas, angles, and concepts on demand.",
      image: "https://via.placeholder.com/300x200?text=Brainstorming+AI",
    },
    {
      key: "productivity",
      name: "Productivity Assistant",
      emoji: "⚙️",
      blurb: "Draft, polish, and automate busywork in seconds.",
      image: "https://via.placeholder.com/300x200?text=Productivity+AI",
    },
  ];

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.headline}>Supercharge Your Workflow 🚀</h1>
        <p style={styles.slogan}>"The right tool, at the right time."</p>
        <p style={styles.intro}>
          Explore our collection of smart AI tools built to help you summarize
          faster, brainstorm better, and get more done in less time.
        </p>
      </section>

      {/* Tools Grid */}
      <section>
        <h2 style={styles.sectionTitle}>Our Tools</h2>
        <div style={styles.grid}>
          {tools.map((tool) => (
            <div key={tool.key} style={styles.card}>
              <img src={tool.image} alt={tool.name} style={styles.cardImage} />
              <div style={styles.cardBody}>
                <span style={styles.emoji}>{tool.emoji}</span>
                <h3 style={styles.cardTitle}>{tool.name}</h3>
                <p style={styles.cardBlurb}>{tool.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Extra Section */}
      <section style={styles.extra}>
        <img
          src="https://via.placeholder.com/500x300?text=AI+Tools+in+Action"
          alt="AI in action"
          style={styles.extraImage}
        />
        <div style={styles.extraText}>
          <h2>Why Choose Our AI Tools?</h2>
          <p>
            We designed these assistants to cut through noise and deliver results
            that matter. Whether you’re a busy professional, a student, or a
            creator, our tools adapt to your needs and boost productivity.
          </p>
        </div>
      </section>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Arial, sans-serif',
    color: "#0f172a",
  },
  hero: {
    textAlign: "center",
    marginBottom: 50,
  },
  headline: {
    fontSize: 42,
    fontWeight: 800,
    marginBottom: 10,
  },
  slogan: {
    fontSize: 20,
    fontStyle: "italic",
    color: "#6366f1",
    marginBottom: 15,
  },
  intro: {
    fontSize: 16,
    color: "#475569",
    maxWidth: 700,
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 20,
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    background: "#fff",
    overflow: "hidden",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    transition: "transform .2s",
  },
  cardImage: {
    width: "100%",
    height: 180,
    objectFit: "cover",
  },
  cardBody: {
    padding: 16,
  },
  emoji: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    margin: "6px 0",
  },
  cardBlurb: {
    fontSize: 14,
    color: "#475569",
  },
  extra: {
    display: "flex",
    alignItems: "center",
    gap: 30,
    marginTop: 60,
    flexWrap: "wrap",
  },
  extraImage: {
    flex: 1,
    maxWidth: 500,
    borderRadius: 12,
  },
  extraText: {
    flex: 1,
    minWidth: 280,
  },
};

export default ToolsPage;
