import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const LandingPage = () => {
  return (
    <div style={pageStyle}>
      <header style={heroStyle}>
        <h1 style={titleStyle}>
          Welcome to <span style={{ color: 'var(--primary-pink)' }}>My</span>Marvel
        </h1>
        <p style={subtitleStyle}>
          Your ultimate playground for Marvel heroes!
        </p>
        <Link to="/signup">
          <button style={{ marginTop: '30px' }}>Get Started</button>
        </Link>
      </header>

      <section style={featuresSectionStyle}>
        <h2 style={sectionTitleStyle}>What You Can Do</h2>
        <div style={featuresGridStyle}>
          <div className="feature-card" style={featureCardStyle}>
            <h3 style={featureTitleStyle}>Discover Heroes</h3>
            <p>Explore a huge universe of Marvel characters.</p>
          </div>
          <div className="feature-card" style={featureCardStyle}>
            <h3 style={featureTitleStyle}>Build Your Squad</h3>
            <p>Create and customize your dream team of heroes.</p>
          </div>
          <div className="feature-card" style={featureCardStyle}>
            <h3 style={featureTitleStyle}>Battle It Out</h3>
            <p>Challenge friends and see whose squad reigns supreme.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Inline Styles
const pageStyle = {
  textAlign: 'center',
  padding: '40px 20px',
};

const heroStyle = {
  padding: '60px 20px',
  background: '#ffffff',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
  marginBottom: '60px',
};

const titleStyle = {
  fontSize: '4.5rem',
  fontWeight: '700',
  color: 'var(--primary-purple)',
  marginBottom: '10px',
};

const subtitleStyle = {
  fontSize: '1.8rem',
  color: 'var(--dark-text)',
  opacity: 0.8,
};

const featuresSectionStyle = {
  padding: '40px 0',
};

const sectionTitleStyle = {
  fontSize: '3.5rem',
  color: 'var(--dark-text)',
  marginBottom: '40px',
};

const featuresGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '30px',
  maxWidth: '1200px',
  margin: '0 auto',
};

const featureCardStyle = {
  backgroundColor: 'var(--light-bg)',
  padding: '40px 30px',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
  borderTop: '5px solid var(--accent-yellow)',
};

const featureTitleStyle = {
  fontSize: '2rem',
  color: 'var(--accent-blue)',
  marginBottom: '15px',
};

export default LandingPage;
