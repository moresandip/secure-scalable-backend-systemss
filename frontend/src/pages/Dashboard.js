import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Dashboard</h1>
      
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2>Welcome, {user?.name}!</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>
          Email: {user?.email} | Role: <span className={`badge badge-${user?.role === 'admin' ? 'high' : 'low'}`}>{user?.role}</span>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <Link to="/tasks" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', textAlign: 'center' }}>
            <h3>My Tasks</h3>
            <p style={{ color: '#666', marginTop: '10px' }}>
              View and manage your tasks
            </p>
          </div>
        </Link>

        <div className="card" style={{ textAlign: 'center' }}>
          <h3>Quick Stats</h3>
          <p style={{ color: '#666', marginTop: '10px' }}>
            Your productivity at a glance
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Getting Started</h3>
        <ul style={{ marginTop: '10px', marginLeft: '20px', color: '#666' }}>
          <li>Create tasks by navigating to the Tasks page</li>
          <li>Set priorities and due dates to stay organized</li>
          <li>Track your progress with status updates</li>
          {user?.role === 'admin' && (
            <li>As an admin, you can manage all users and their tasks</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
