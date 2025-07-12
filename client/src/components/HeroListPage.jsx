import React, { useEffect, useState } from 'react';
import CharacterCard from './CharacterCard';
import '../App.css';

const HeroListPage = () => {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchInitialHeroes = async () => {
      try {
        const response = await fetch('http://localhost:5000/heroes');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setHeroes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialHeroes();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/character?name=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  if (loading) return <div style={loadingStyle}>Loading Heroes...</div>;
  if (error) return <div style={errorStyle}>Error: {error}</div>;

  const heroesToDisplay = searchTerm.trim() ? searchResults : heroes;

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Find Your Hero</h1>
      <div style={searchContainerStyle}>
        <input
          type="text"
          placeholder="Search for a hero... (e.g., Spider-Man)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={searchInputStyle}
        />
        <button onClick={handleSearch} disabled={searching}>
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div style={gridStyle}>
        {heroesToDisplay.length > 0 ? (
          heroesToDisplay.map((hero) => (
            <CharacterCard key={hero.id} character={hero} context="heroes" />
          ))
        ) : (
          searchTerm.trim() && !searching && <div style={noResultsStyle}>No hero found with that name. Try another!</div>
        )}
      </div>
    </div>
  );
};

// Inline Styles
const pageStyle = {
  padding: '40px 20px',
};

const titleStyle = {
  fontSize: '4rem',
  marginBottom: '30px',
  textAlign: 'center',
  color: 'var(--dark-text)',
};

const searchContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '50px',
  gap: '15px',
};

const searchInputStyle = {
  width: '400px',
  fontSize: '1.1rem',
  padding: '14px 20px',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '40px',
  maxWidth: '1600px',
  margin: '0 auto',
};

const loadingStyle = {
  fontSize: '2.5rem',
  textAlign: 'center',
  padding: '60px',
  color: 'var(--primary-purple)',
};

const errorStyle = {
  fontSize: '1.5rem',
  textAlign: 'center',
  padding: '60px',
  color: 'var(--primary-pink)',
};

const noResultsStyle = {
  fontSize: '1.8rem',
  textAlign: 'center',
  padding: '60px',
  color: 'var(--dark-text)',
  gridColumn: '1 / -1',
  opacity: 0.8,
};

export default HeroListPage;