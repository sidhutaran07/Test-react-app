
import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const BookSubmissionPage = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}/books`, {
        title,
        author,
      });
      setMessage("✅ Book submitted successfully!");
      setTitle("");
      setAuthor("");
    } catch (err) {
      console.error("Error submitting book:", err);
      setMessage("❌ Failed to submit book");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2>Submit a Book</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Author Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px" }}>
          Submit
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BookSubmissionPage;
