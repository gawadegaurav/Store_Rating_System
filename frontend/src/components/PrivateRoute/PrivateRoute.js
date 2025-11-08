import React from 'react';
import { Navigate } from 'react-router-dom';
import './PrivateRoute.css'; // ✅ Imported CSS file

export default function PrivateRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token) return <Navigate to="/login" />;

  if (role && user?.role !== role) {
    // redirect to role home if different
    if (user.role === 'ADMIN') return <Navigate to="/admin" />;
    if (user.role === 'OWNER') return <Navigate to="/owner" />;
    return <Navigate to="/user" />;
  }

  return (
    <div className="private-route-container">
      {children}
    </div>
  );
}
