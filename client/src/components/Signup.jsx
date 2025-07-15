import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      const userCredential = await signup(email, password);
      const { user } = userCredential;
      await fetch("http://localhost:5000/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: user.uid, email: user.email }),
      });
      navigate('/heroes');
    } catch (err) {
      setError(`Failed to create an account: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 style={titleStyle}>Create Your Account</h2>
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            style={inputStyle}
          />
          <button disabled={loading} type="submit" style={{ width: '100%', marginTop: '10px' }}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div style={linkStyle}>
          Already have an account? <Link to="/login">Log In</Link>
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

export default Signup;
