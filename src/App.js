import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Import all your pages and components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute'; // Import the guard
import HomePage from './components/HomePage';
import ProgressPage from './components/ProgressPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CountdownPage from './components/CountdownPage';
import AIToolPage from './components/AIToolPage';
import AIToolsPage from './components/AIToolsPage';
import ToolsPage from './components/ToolsPage';
import LeadsPage from './components/LeadsPage';
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Navbar user={user} />
      <div style={{ padding: '20px' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/timer" element={<CountdownPage />} />

          {/* --- Protected Routes --- */}
          {/* These routes are now wrapped in the ProtectedRoute component */}
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

            <Route
            path="/ai-tool"
            element={
              <ProtectedRoute user={user}>
                <AIToolPage />
              </ProtectedRoute>
  }
/>

<Route path="/ai-tools" element={<AIToolsPage /> } />

<Route path="/tools" element={<ToolsPage />} />

  <Route path="leads" element={<LeadsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
