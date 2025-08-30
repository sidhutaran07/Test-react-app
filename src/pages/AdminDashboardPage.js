import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { getAuth } from 'firebase/auth'; // ✅ Firebase Auth import

// Users table columns
const userColumns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
  { header: 'Qualification', accessor: 'qualification' },
  { header: 'Contact', accessor: 'contact' },
  { header: 'Social Media', accessor: 'socialMedia' },
];

// Leads table columns
const leadColumns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
  { header: 'Interested In', accessor: 'interestedIn' },
  { header: 'Category', accessor: 'category' },
];

function AdminDashboardPage() {
  const [data, setData] = useState({ users: [], leads: [] });
  const [message, setMessage] = useState('');
  const [accessed, setAccessed] = useState(false);

  const handleAccess = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setMessage('⚠️ You must be logged in with Firebase.');
        return;
      }

      // ✅ Fetch Firebase ID token
      const token = await user.getIdToken();

      const response = await fetch('/api/admin/data', {
        method: 'GET', // backend expects GET
        headers: {
          Authorization: `Bearer ${token}`, // pass token in Authorization header
        },
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
        setAccessed(true);
      } else {
        const error = await response.json();
        setMessage(error.message || error.error || 'Access denied.');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
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
