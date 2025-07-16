import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setError('');
    alert('Logged in successfully!');
    navigate("/")
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#fcdde9' }}>
      <form onSubmit={handleLogin} style={{ background: 'white', padding: 20, borderRadius: 10, width: 300 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 5, border: '1px solid #ccc' }}
        />

        {error && <p style={{ color: 'red', fontSize: 14 }}>{error}</p>}

        <button type="submit" style={{ width: '100%', padding: 10, background: '#f06292', color: 'white', border: 'none', borderRadius: 5 }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
