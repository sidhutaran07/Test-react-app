import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://react-todolist-7cwa.onrender.com/api';

const ProgressPage = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/stats`);
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []); // Empty array ensures this runs only once when the page loads

  const getTodayKey = () => new Date().toISOString().split('T')[0];

  const today = getTodayKey();
  const todayStats = stats[today] || { created: 0, completed: 0 };
  const productivityScore = todayStats.created > 0
    ? Math.round((todayStats.completed / todayStats.created) * 100)
    : 0;

  // Get past days' data, sort from most recent to oldest
  const pastDays = Object.keys(stats)
    .filter(date => date !== today)
    .sort((a, b) => new Date(b) - new Date(a));
    
  if (loading) {
    return <div>Loading your progress...</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h2>Your Progress Dashboard 📊</h2>
      
      {/* Today's Stats */}
      <div style={{ background: '#f0f8ff', padding: 15, borderRadius: 8, marginBottom: 20 }}>
        <h4>Today's Summary ({new Date(today).toDateString()})</h4>
        <p><strong>Tasks Created:</strong> {todayStats.created}</p>
        <p><strong>Tasks Completed:</strong> {todayStats.completed}</p>
        <p><strong>Productivity Score:</strong> {productivityScore}%</p>
      </div>

      {/* Past Data */}
      {pastDays.length > 0 ? (
        <div>
          <h4>Past Activity</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {pastDays.map(date => {
              const dayStats = stats[date];
              const score = dayStats.created > 0 ? Math.round((dayStats.completed / dayStats.created) * 100) : 0;
              return (
                <li key={date} style={{ background: '#f9f9f9', padding: '10px', borderRadius: 5, marginBottom: 8 }}>
                  <strong>{new Date(date).toDateString()}:</strong> Created {dayStats.created}, Completed {dayStats.completed} ({score}%)
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
         <p>No past activity found. Start completing tasks to see your history!</p>
      )}
    </div>
  );
};

export default ProgressPage;
