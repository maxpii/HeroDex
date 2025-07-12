import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAuth } from 'firebase/auth';
import CharacterCard from './CharacterCard';
import '../App.css';

const DecksPage = () => {
  const [deck, setDeck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchDeck = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const idToken = await getAuth().currentUser.getIdToken();
        const response = await fetch('http://localhost:5000/api/deck', {
          headers: { 'Authorization': `Bearer ${idToken}` },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setDeck(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, [currentUser]);

  const handleRemoveFromDeck = async (heroId) => {
    try {
      const idToken = await getAuth().currentUser.getIdToken();
      await fetch(`http://localhost:5000/api/deck/${heroId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${idToken}` },
      });
      setDeck(deck.filter(hero => hero.id !== heroId));
    } catch (error) {
      console.error("Error removing hero from deck:", error);
      alert("An error occurred while removing the hero from the deck.");
    }
  };

  if (loading) return <div style={loadingStyle}>Loading Your Deck...</div>;
  if (error) return <div style={errorStyle}>Error: {error}</div>;
  if (!currentUser) return <div style={authMessageStyle}>Please log in to see your deck.</div>;

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>My Deck</h1>
      <div style={gridStyle}>
        {deck.length > 0 ? (
          deck.map((hero) => (
            <CharacterCard key={hero.id} character={hero} context="deck" onRemove={handleRemoveFromDeck} />
          ))
        ) : (
          <p style={emptyMessageStyle}>Your deck is empty. Add some heroes to get started!</p>
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

export default DecksPage;