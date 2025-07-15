import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
const LandingPage = () => {
  return (
    <div className="landing-page">
        <header className="hero">
          <h1>
            Welcome to <span>My</span>Marvel
          </h1>
          <p>
            Your ultimate playground for Marvel heroes!
          </p>
          <Link to="/signup">
            <button>Get Started</button>
          </Link>
        </header>

        <section className="features-section">
        <h2>What You Can Do</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Discover Heroes</h3>
            <p>Explore a huge universe of Marvel characters.</p>
          </div>
          <div className="feature-card">
            <h3>Build Your Squad</h3>
            <p>Create and customize your dream team of heroes.</p>
          </div>
          <div className="feature-card">
            <h3>Battle It Out</h3>
            <p>Challenge friends and see whose squad reigns supreme.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
