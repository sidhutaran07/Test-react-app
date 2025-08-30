// frontend/src/pages/AdminDashboardPage.js
import React, { useState } from "react";
import DataTable from "../components/DataTable";
import { getAuth } from "firebase/auth";
import api from "../api"; // ✅ axios instance

// Users table columns
const userColumns = [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { header: "Qualification", accessor: "qualification" },
  { header: "Contact", accessor: "contact" },
  { header: "Social Media", accessor: "socialMedia" },
];

// Leads table columns
const leadColumns = [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { header: "Interested In", accessor: "interestedIn" },
];

function AdminDashboardPage() {
  const [data, setData] = useState({ users: [], leads: [] });
  const [message, setMessage] = useState("");
  const [accessed, setAccessed] = useState(false);

  const handleAccess = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setMessage("⚠️ You must be logged in with Firebase.");
        return;
      }

      // ✅ Firebase token
      const token = await user.getIdToken();

      // ✅ axios GET request with token
      const response = await api.get("/admin/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(response.data); // axios gives data directly
      setAccessed(true);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message
      );
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {!accessed ? (
        <form onSubmit={handleAccess}>
          <p>Click below to access the Admin Dashboard</p>
          <button type="submit">Access Dashboard</button>
        </form>
      ) : (
        <div>
          <DataTable title="Users" items={data.users} columns={userColumns} />
          <hr />
          <DataTable title="Leads" items={data.leads} columns={leadColumns} />
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default AdminDashboardPage;
