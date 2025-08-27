import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const AIToolPage = () => {
  // States
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const feedbackFormRef = useRef();

  // Send prompt to n8n
  const handleSubmit = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setResult('');
    setError('');

    try {
      const response = await fetch(process.env.REACT_APP_N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const data = await response.json();
      const { title, introduction, content } = data.output;

      // Render result in markdown
      setResult(`# ${title}\n\n${introduction}\n\n${content}`);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Example prompts
  const examples = ["Startup ideas", "Blog post topics", "Product features"];

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center',
        borderRadius: '0 0 20px 20px'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
          Supercharge Your Productivity with AI Tools
        </h1>
        <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
          Explore intelligent assistants to brainstorm, plan, and optimize your work.
        </p>
      </div>

      {/* Tool Tiles */}
      {/* --- MODIFICATION START --- */}
      <div style={{
        display: 'flex',
        justifyContent: 'center', // Center the items
        marginTop: '3rem',
        flexWrap: 'wrap',
        gap: '2rem' // Add space between items
      }}>
      {/* --- MODIFICATION END --- */}
        {[
          {
            name: "Brainstorming AI",
            img: "/images/robot1.png",
            features: ["Idea generation", "Concept mapping", "Creative prompts"],
            link: "/ai-tools/brainstorming"
          },
          {
            name: "Productivity Assistant",
            img: "/images/robot2.png",
            features: ["Task management", "Reminders", "Focus sessions"],
            link: "/ai-tools/productivity"
          },
          {
            name: "Summary AI",
            img: "/images/robot3.png",
            features: ["Text summarization", "Key points extraction", "Reports"],
            link: "/ai-tools/summary"
          }
        ].map((tool) => (
          // --- MODIFICATION START ---
          <div key={tool.name} style={{
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            textAlign: 'center',
            flex: '0 1 300px', // Control size: no grow, can shrink, base width 300px
            boxSizing: 'border-box' // Ensure padding is included in the width
          }}>
          {/* --- MODIFICATION END --- */}
            <img src={tool.img} alt={tool.name} style={{ width: '80px', marginBottom: '1rem' }} />
            <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{tool.name}</h3>
            <ul style={{ textAlign: 'left', marginBottom: '1rem' }}>
              {tool.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <a href={tool.link} style={{
              textDecoration: 'none',
              color: 'white',
              background: '#007bff',
              padding: '0.5rem 1rem',
              borderRadius: '8px'
            }}>Try Now</a>
          </div>
        ))}
      </div>

      {/* AI Tool Input Section */}
      <div style={{ marginTop: '4rem', textAlign: 'center' }}>
        <h2>Brainstorm with AI</h2>
        <p>Try these examples:</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {examples.map((ex) => (
            <button key={ex} onClick={() => setPrompt(ex)} style={{
              border: '1px solid #007bff',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              background: 'white',
              cursor: 'pointer'
            }}>{ex}</button>
          ))}
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your idea or prompt..."
          style={{ width: '90%', maxWidth: '700px', height: '150px', padding: '12px', marginTop: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            marginTop: '1rem',
            padding: '12px 25px',
            fontSize: '1rem',
            color: '#fff',
            backgroundColor: loading ? '#aaa' : '#007bff',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Thinking...' : 'Generate'}
        </button>

        {/* Error */}
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>Error: {error}</p>}

        {/* AI Result */}
        {result && (
          <div style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '700px', margin: '2rem auto', background: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '1rem' }}>
            <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>Response:</h3>
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Feedback Form */}
      {!feedbackSubmitted ? (
        <form
          ref={feedbackFormRef}
          name="ai-feedback"
          method="POST"
          data-netlify="true"
          onSubmit={(e) => {
            e.preventDefault();
            const form = feedbackFormRef.current;
            const formData = new FormData(form);
            fetch("/", { method: "POST", body: formData })
              .then(() => setFeedbackSubmitted(true))
              .catch((err) => alert("Submission failed: " + err));
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '700px', margin: '3rem auto' }}
        >
          <input type="hidden" name="form-name" value="ai-feedback" />

          <label>Your Name
            <input type="text" name="name" required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }} />
          </label>

          <label>Feedback
            <textarea name="message" rows="4" required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }} />
          </label>

          <button type="submit" style={{ padding: '12px', borderRadius: '8px', background: '#007bff', color: 'white', cursor: 'pointer' }}>
            Submit
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: '1rem', background: '#d4edda', borderRadius: '8px', margin: '2rem auto', maxWidth: '700px' }}>
          <h3>🎉 Thanks for your feedback!</h3>
          <p>We’ll use it to make the AI tool even better.</p>
        </div>
      )}
    </div>
  );
};

export default AIToolPage;
