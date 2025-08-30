// Frontend: src/BookSubmissionPage.js (Page 2: Book Submission Leads Form)
import React, { useState } from 'react';
import API_BASE_URL from "../config";
function BookSubmissionPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interestedIn: 'A',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setMessage('Lead submitted successfully!');
      } else {
        setMessage('Error submitting lead.');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Book Submission Leads</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label><br />
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label><br />
        <label>
          Interested in:
          <select name="interestedIn" value={formData.interestedIn} onChange={handleChange}>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </label><br />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default BookSubmissionPage;

