import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user }) => {
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
  };

  return (
    <nav style={navStyle}>
      {/* This is the part you asked about */}
      <div>
        <Link to="/" style={linkStyle}>
          Home
        </Link>
        {user && (
          <Link to="/progress" style={linkStyle}>
            Progress
          </Link>
        )}
        <Link to="/timer" style={linkStyle}>
          Focus Timer
        </Link>
      </div>

      {/* This part handles the Login/Logout button */}
      <div>
        {user ? (
          <a href="http://localhost:5000/api/auth/logout" style={linkStyle}>
            Logout
          </a>
        ) : (
          <Link to="/login" style={linkStyle}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
