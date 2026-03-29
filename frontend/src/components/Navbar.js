import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div>
        <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
          Task Manager
        </Link>
      </div>
      <div>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/tasks">Tasks</Link>
            <span style={{ marginLeft: '20px', color: '#aaa' }}>
              {user.name} ({user.role})
            </span>
            <button 
              onClick={handleLogout}
              style={{
                marginLeft: '20px',
                background: 'transparent',
                border: '1px solid white',
                color: 'white',
                padding: '5px 15px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
