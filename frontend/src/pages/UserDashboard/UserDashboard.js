import React from 'react';
import './UserDashboard.css';

export default function UserDashboard() {
  return (
    <div className="user-dashboard">
      <div className="dashboard-card">
        <h2 className="dashboard-title">User Dashboard</h2>
        <p className="dashboard-text">
          Go to{' '}
          <a href="/stores" className="dashboard-link">
            Stores
          </a>{' '}
          to submit/modify ratings and search stores.
        </p>
      </div>
    </div>
  );
}
