import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

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
      const response = await fetch(process.env.REACT_APP_N8N_WEBHOOK_URL, {
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

      // IMPORTANT: Adjust 'aiResponse' to match the JSON key your n8n workflow returns.
      // For example, if n8n returns {"text": "..."}, you should use data.text
      const aiText = data.aiResponse; 
      
      if (!aiText) {
        throw new Error("The response from the workflow was empty or in the wrong format.");
      }
      
      setResult(aiText);

    } catch (err) {
      setError(err.message);
      console.error("Error communicating with n8n:", err);
    } finally {
      setLoading(false);
    }
  };

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

export default AIToolPage;

