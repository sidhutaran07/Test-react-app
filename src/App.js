import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Import your components and pages
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/HomePage';
import ProgressPage from './components/ProgressPage';
import LoginPage from './components/LoginPage';
import CountdownPage from './components/CountdownPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('https://react-todolist-7cwa.onrender.com/api/auth/current_user');
        setUser(res.data || null);
      } catch (error) {
        console.error("Could not fetch user", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar user={user} />

        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/timer" element={<CountdownPage />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute user={user}>
                  <HomePage user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute user={user}>
                  <ProgressPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
