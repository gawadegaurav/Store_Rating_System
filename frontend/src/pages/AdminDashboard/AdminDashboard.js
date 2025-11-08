import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      {stats ? (
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Stores</h3>
            <p>{stats.totalStores}</p>
          </div>
          <div className="stat-card">
            <h3>Total Ratings</h3>
            <p>{stats.totalRatings}</p>
          </div>
        </div>
      ) : (
        <p className="loading-text">Loading...</p>
      )}
      <p className="note-text">Use API to add users and view lists via admin routes.</p>
    </div>
  );
}
