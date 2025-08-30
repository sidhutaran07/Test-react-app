import React, { useState } from 'react';
// 1. Import the new components
import BookSubmissionPagefrom './components/BookSubmissionPage';
import UserInfoPage from './components/UserInfoPage';

function AdminDashboardPage() {
  const [email, setEmail] = useState('');
  const [data, setData] = useState({ users: [], leads: [] });
  const [message, setMessage] = useState('');
  const [accessed, setAccessed] = useState(false);

  // This data fetching logic remains the same
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
        setMessage(''); // Clear any previous error messages
      } else {
        const error = await response.json();
        setMessage(`Access denied: ${error.message}`);
        setAccessed(false);
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
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label><br />
          <button type="submit">Access Dashboard</button>
        </form>
      ) : (
        // 2. Instead of tables, we now render our new components
        //    and pass the data to them as props.
        <div>
          <UserList users={data.users} />
          <hr /> {/* Optional: a line to separate the two tables */}
          <LeadList leads={data.leads} />
        </div>
      )}
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
}

export default AdminDashboardPage;
