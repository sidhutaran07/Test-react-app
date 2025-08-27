// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

export default function AdminPanel() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [promoteUid, setPromoteUid] = useState('');
  const [promoteStatus, setPromoteStatus] = useState('');

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          setIsAdmin(idTokenResult.claims.admin === true);
        } catch (err) {
          console.error('Failed to get admin claim', err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [user]);

  // Fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      if (!user) return;

      const token = await user.getIdToken();
      try {
        const res = await fetch('/api/leads', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setLeads(data);
        } else {
          console.error('Failed to fetch leads');
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchLeads();
  }, [user]);

  // Promote user to admin
  const handlePromote = async () => {
    if (!promoteUid) return;

    const token = await user.getIdToken();
    try {
      const res = await fetch('/api/admin/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUid: promoteUid }),
      });

      const data = await res.json();
      if (res.ok) {
        setPromoteStatus('User promoted successfully!');
        setPromoteUid('');
      } else {
        setPromoteStatus(data.message || 'Failed to promote user.');
      }
    } catch (err) {
      console.error(err);
      setPromoteStatus('Error promoting user.');
    }
  };

  if (!user) return <p>Please log in to access the admin panel.</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Panel</h1>

      {/* Leads Section */}
      <section>
        <h2>Leads</h2>
        {leads.length === 0 ? (
          <p>No leads found.</p>
        ) : (
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{new Date(lead.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Promote User Section (Admin Only) */}
      {isAdmin && (
        <section style={{ marginTop: '40px' }}>
          <h2>Promote User to Admin</h2>
          <input
            type="text"
            placeholder="Enter User UID"
            value={promoteUid}
            onChange={(e) => setPromoteUid(e.target.value)}
          />
          <button onClick={handlePromote} style={{ marginLeft: '10px' }}>
            Promote
          </button>
          {promoteStatus && <p>{promoteStatus}</p>}
        </section>
      )}
    </div>
  );
}
