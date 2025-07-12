import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/heroes');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 style={titleStyle}>Welcome Back!</h2>
        {error && <p style={errorStyle}>{error}</p>}
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button disabled={loading} type="submit" style={{ width: '100%', marginTop: '10px' }}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
        <div style={linkStyle}>
          Need an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

// Inline Styles
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '90vh',
  padding: '20px',
};

const formContainerStyle = {
  backgroundColor: 'var(--light-bg)',
  padding: '50px',
  borderRadius: '20px',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '420px',
  textAlign: 'center',
};

const titleStyle = {
  fontSize: '2.8rem',
  marginBottom: '30px',
  color: 'var(--dark-text)',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const inputStyle = {
  width: 'calc(100% - 28px)', // Account for padding
};

const errorStyle = {
  color: 'var(--primary-pink)',
  marginBottom: '20px',
  fontWeight: 'bold',
  fontSize: '0.9rem',
};

const linkStyle = {
  marginTop: '25px',
  fontSize: '1rem',
};

export default Login;
