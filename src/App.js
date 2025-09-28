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
import ToolsPage from './components/ToolsPage';
import BookSubmissionPage from './components/BookSubmissionPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UserInfoPage from './components/UserInfoPage';
import Inventory from './pages/Inventory';
import Soundcloudwidget from './components/Soundcloudwidget';
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
           <Route path="/tools" element={<ToolsPage />} />
    <Route path="/sound" element={<soundcloud/>}/>

  <Route path="/BookSubmission" element={<BookSubmissionPage/>} />
  <Route path="/UserInfo" element={<UserInfoPage/>} />
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




  <Route
  path="/admindashboard"
  element={
    <ProtectedRoute user={user}>
      <AdminDashboardPage/>
    </ProtectedRoute> } /> 
  
    <Route 
    path="/inventory"
      element={
      <ProtectedRoute user={user}>
        <Inventory/>  
      
    </ProtectedRoute>
  }
/>
  </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
