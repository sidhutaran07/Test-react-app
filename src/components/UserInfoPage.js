import React, { useState } from "react";
import api from "../api";

function UserInfoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    qualification: "",
    contact: "",
    socialMedia1: "",
    socialMedia2: "",
    socialMedia3: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users", {
        name: formData.name,
        email: formData.email,
        qualification: formData.qualification,
        contact: formData.contact,
        socialMedia: [
          formData.socialMedia1,
          formData.socialMedia2,
          formData.socialMedia3,
        ],
      });
      setMessage("✅ User information submitted successfully!");
    } catch (error) {
      setMessage("❌ Error submitting user information.");
    }
  };

  return (
    <div>
      <h2>User Information</h2>
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
          Highest Qualification:
          <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} required />
        </label><br />
        <label>
          Contact Number:
          <input type="tel" name="contact" value={formData.contact} onChange={handleChange} required />
        </label><br />
        <label>
          Social Media Link 1:
          <input type="url" name="socialMedia1" value={formData.socialMedia1} onChange={handleChange} />
        </label><br />
        <label>
          Social Media Link 2:
          <input type="url" name="socialMedia2" value={formData.socialMedia2} onChange={handleChange} />
        </label><br />
        <label>
          Social Media Link 3:
          <input type="url" name="socialMedia3" value={formData.socialMedia3} onChange={handleChange} />
        </label><br />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UserInfoPage;
