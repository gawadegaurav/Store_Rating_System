import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Header/Header.css'; // Import external CSS

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="header-container">
      <div className="header-left">
        <Link to="/stores" className="header-link">Stores</Link>
        {' | '}
        {token ? (
          <span onClick={logout} className="header-logout">Logout</span>
        ) : (
          <>
            <Link to="/login" className="header-link">Login</Link> {' | '}
            <Link to="/signup" className="header-link">Signup</Link>
          </>
        )}
      </div>
      <div className="header-right">
        {user ? <span className="header-user">{user.name} ({user.role})</span> : null}
      </div>
    </div>
  );
}
