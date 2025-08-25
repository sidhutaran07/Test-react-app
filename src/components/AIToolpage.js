import React, { useState, useref } from 'react';

const AIToolPage = () => {
  // State for the user's input
  const [prompt, setPrompt] = useState('');
  // State to show a loading message
  const [loading, setLoading] = useState(false);
  // State for the AI's response from n8n
  const [result, setResult] = useState('');
  // State to display any errors
  const [error, setError] = useState('');

  // Function to send the prompt to your n8n webhook
  const handleSubmit = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setResult('');
    setError('');

    try {
      // Send a POST request to your n8n webhook URL
      const response = await fetch("process.env.REACT_APP_N8N_WEBHOOK_URL", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the prompt in a simple JSON object
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!response.ok) {
        throw new Error(`The request failed with status: ${response.status}`);
      }

      const data = await response.json();
const { title, introduction, content } = data.output;

setResult(`${title}\n\n${introduction}\n\n${content}`);

    } catch (err) {
      setError(err.message);
      console.error("Error communicating with n8n:", err);
    } finally {
      setLoading(false);
    }
  };


function AIToolPage() {
  // Track if form has been submitted
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Reference to the form
  const feedbackFormRef = useRef();

  // ... rest of your component
}
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>AI Tool</h1>
      <p>Powered by n8n Automation</p>
      
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="What would you like to ask?"
        style={{ width: '90%', maxWidth: '700px', height: '150px', padding: '12px', fontSize: '1rem', border: '1px solid #ddd', borderRadius: '8px', margin: '0 auto 20px', display: 'block' }}
      />
      
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: '12px 25px',
          fontSize: '1rem',
          color: '#fff',
          backgroundColor: loading ? '#aaa' : '#007bff',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Thinking...' : 'Submit'}
      </button>

      {/* Display Error Message */}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>Error: {error}</p>}

      {/* Display Result from n8n */}
      {result && (
        <div style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '700px', margin: '2rem auto', background: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '1rem' }}>
          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>Response:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'inherit', fontSize: '1rem' }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  );
};

// Inside your existing AI tool page component

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
        .catch((error) => alert("Submission failed: " + error));
    }}
    className="flex flex-col space-y-4 mt-6"
  >
    <input type="hidden" name="form-name" value="ai-feedback" />

    <label className="flex flex-col text-sm font-medium">
      Your Name
      <input
        type="text"
        name="name"
        className="border rounded p-2 mt-1"
        placeholder="Enter your name"
        required
      />
    </label>

    <label className="flex flex-col text-sm font-medium">
      Feedback
      <textarea
        name="message"
        rows="4"
        className="border rounded p-2 mt-1"
        placeholder="What should we improve?"
        required
      />
    </label>

    <button
      type="submit"
      className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Submit
    </button>
  </form>
) : (
  <div className="text-center p-4 bg-green-100 rounded mt-6">
    <h3 className="font-semibold text-lg">🎉 Thanks for your feedback!</h3>
    <p>We’ll use it to make the AI tool even better.</p>
  </div>
)}

export default AIToolPage;

