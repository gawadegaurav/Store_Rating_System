import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (name.length < 20 || name.length > 60) { setErr('Name must be 20-60 chars'); return; }
    if (password.length < 8 || password.length > 16) { setErr('Password length 8-16'); return; }
    try {
      await api.post('/auth/signup', { name, email, address, password });
      navigate('/login');
    } catch (error) {
      setErr(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Signup (Normal User)</h2>
        <form onSubmit={submit} className="signup-form">
          <input
            type="text"
            placeholder="Full name (20-60 chars)"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="signup-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="signup-input"
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="signup-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="signup-input"
          />
          {err && <div className="signup-error">{err}</div>}
          <button type="submit" className="signup-button">Sign up</button>
        </form>
      </div>
    </div>
  );
}
