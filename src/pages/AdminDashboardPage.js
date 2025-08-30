import React, { useState } from 'react';
// 1. Import the single, reusable component
import DataTable from '../components/DataTable';

// 2. Define the columns for the Users table
const userColumns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
  { header: 'Qualification', accessor: 'qualification' },
  { header: 'Contact', accessor: 'contact' },
  { header: 'Social Media', accessor: 'socialMedia' },
];

// 3. Define the columns for the Leads table
const leadColumns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
  { header: 'Interested In', accessor: 'interestedIn' },
  { header: 'Category', accessor: 'category' },
];

function AdminDashboardPage() {
  const [email, setEmail] = useState('');
  const [data, setData] = useState({ users: [], leads: [] });
  const [message, setMessage] = useState('');
  const [accessed, setAccessed] = useState(false);

  const handleAccess = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
        setAccessed(true);
      } else {
        setMessage('Access denied.');
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
          <label>
            Enter Admin Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Access Dashboard</button>
        </form>
      ) : (
        <div>
          {/* 4. Use the DataTable for BOTH users and leads */}
          <DataTable
            title="Users"
            items={data.users}
            columns={userColumns}
          />
          <hr />
          <DataTable
            title="Leads"
            items={data.leads}
            columns={leadColumns}
          />
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
} // ✅ properly close the component function

export default AdminDashboardPage;
