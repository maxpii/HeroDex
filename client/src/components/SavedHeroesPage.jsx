import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAuth } from 'firebase/auth';
import CharacterCard from './CharacterCard';
import '../App.css';

const SavedHeroesPage = () => {
  const [savedHeroes, setSavedHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchSavedHeroes = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const idToken = await getAuth().currentUser.getIdToken();
        const response = await fetch('http://localhost:5000/api/savedHeroes', {
          headers: { 'Authorization': `Bearer ${idToken}` },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setSavedHeroes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedHeroes();
  }, [currentUser]);

  const handleRemoveHero = async (heroId) => {
    try {
      const idToken = await getAuth().currentUser.getIdToken();
      await fetch(`http://localhost:5000/api/savedHeroes/${heroId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${idToken}` },
      });
      setSavedHeroes(savedHeroes.filter(hero => hero.id !== heroId));
    } catch (error) {
      console.error("Error removing hero:", error);
      alert("An error occurred while removing the hero.");
    }
  };

  if (loading) return <div style={loadingStyle}>Loading Saved Heroes...</div>;
  if (error) return <div style={errorStyle}>Error: {error}</div>;
  if (!currentUser) return <div style={authMessageStyle}>Please log in to see your saved heroes.</div>;

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>My Saved Heroes</h1>
      <div style={gridStyle}>
        {savedHeroes.length > 0 ? (
          savedHeroes.map((hero) => (
            <CharacterCard key={hero.id} character={hero} context="saved" onRemove={handleRemoveHero} />
          ))
        ) : (
          <p style={emptyMessageStyle}>You haven't saved any heroes yet. Go find some!</p>
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
  marginBottom: '40px',
  textAlign: 'center',
  color: 'var(--dark-text)',
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

const authMessageStyle = {
  fontSize: '1.8rem',
  textAlign: 'center',
  padding: '60px',
  color: 'var(--dark-text)',
};

const emptyMessageStyle = {
  fontSize: '1.8rem',
  textAlign: 'center',
  padding: '60px',
  color: 'var(--dark-text)',
  gridColumn: '1 / -1',
  opacity: 0.8,
};

export default SavedHeroesPage;