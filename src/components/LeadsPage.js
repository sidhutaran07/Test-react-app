// src/pages/LeadsPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";

const LeadsPage = () => {
  const { user, loading } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchLeads = async () => {
      try {
        const token = await user.getIdToken(); // Firebase ID token
        const res = await fetch("https://react-todolist-7cwa.onrender.com/api/leads", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();
        setLeads(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch leads.");
      }
    };

    fetchLeads();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Leads</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {leads.length === 0 ? (
        <p>No leads found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.message}</td>
                <td>{new Date(lead.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeadsPage;
