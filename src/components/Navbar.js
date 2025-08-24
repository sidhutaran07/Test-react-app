import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Import Firebase auth
import { signOut } from 'firebase/auth';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const navStyle = {
    background: '#333',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    margin: '0 1rem',
    fontSize: '1.1rem',
    cursor: 'pointer',
    background: 'none', // Make button look like a link
    border: 'none',    // Make button look like a link
  };

  return (
    <nav style={navStyle}>
      <div>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/timer" style={linkStyle}>Focus Timer</Link>
  <Link to="/ai-tool" style={linkstyle}>AI Tool</Link>

        {user && <Link to="/progress" style={linkStyle}>Progress</Link>}
      </div>
      <div>
        {user ? (
          // This button calls the new handleLogout function
          <button onClick={handleLogout} style={linkStyle}>
            Logout
          </button>
        ) : (
          <Link to="/login" style={linkStyle}>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
