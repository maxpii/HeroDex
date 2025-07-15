import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getAuth } from 'firebase/auth';
import '../App.css';

function CharacterCard({ character, context, onRemove }) {
  const { currentUser, tokens, setTokens } = useAuth();

  const handleAddToDeck = async () => {
    if (!currentUser) return alert("You must be logged in to add to your deck.");

    const cost = Object.values(character.powerstats).reduce((acc, val) => acc + (parseInt(val, 10) || 0), 0);

    if (tokens < cost) {
      return alert("You don't have enough tokens to add this hero to your deck.");
    }

    const newTokens = tokens - cost;

    try {
      const token = await currentUser.getIdToken();
      await fetch('http://localhost:5000/api/user/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tokens: newTokens }),
      });
      setTokens(newTokens);

      // Now, add the hero to the deck
      const response = await fetch('http://localhost:5000/api/addToDeck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hero: character }),
      });

      if (response.ok) {
        alert("Hero added to deck!");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to add hero to deck.");
      }
    } catch (error) {
      console.error("Error adding to deck:", error);
      alert("An error occurred while adding to the deck.");
    }
  };

  const cost = Object.values(character.powerstats).reduce((acc, val) => acc + (parseInt(val, 10) || 0), 0);
  const canAfford = tokens >= cost;

  return (
    <div className="character-card">
      <h2 style={nameStyle}>{character.name}</h2>
      <img src={character.image.url} alt={character.name} style={imageStyle} />
      <div style={infoStyle}>
        <p><strong>Full Name:</strong> {character.biography["full-name"] || "N/A"}</p>
        <p><strong>Occupation:</strong> {character.work.occupation || "N/A"}</p>
      </div>
      <div style={powerstatsStyle}>
        <h4 style={powerstatsTitleStyle}>Powerstats</h4>
        <ul style={listStyle}>
          {Object.entries(character.powerstats).map(([stat, value]) => (
            <li key={stat} style={listItemStyle}>
              <span style={{ textTransform: 'capitalize' }}>{stat}</span>
              <span style={{ color: 'var(--primary-purple)', fontWeight: 'bold' }}>{value}</span>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <strong>Cost: {cost} Tokens</strong>
      </div>
      {currentUser && (
        <div style={buttonContainerStyle}>
          {context === 'heroes' && (
            <button onClick={handleAddToDeck} disabled={!canAfford}>
              {canAfford ? 'Add to Deck' : 'Not Enough Tokens'}
            </button>
          )}
          {context === 'deck' && <button onClick={() => onRemove(character.id)}>Remove</button>}
        </div>
      )}
    </div>
  );
}

// Inline Styles
const nameStyle = {
  fontSize: '2rem',
  color: 'var(--dark-text)',
  marginBottom: '15px',
  fontWeight: '700',
};

const imageStyle = {
  width: '100%',
  height: 'auto',
  borderRadius: '15px',
  marginBottom: '20px',
  border: '4px solid var(--light-gray)',
};

const infoStyle = {
  marginBottom: '20px',
  fontSize: '1rem',
  color: '#555',
};

const powerstatsStyle = {
  textAlign: 'left',
  marginBottom: '25px',
};

const powerstatsTitleStyle = {
  color: 'var(--accent-blue)',
  marginBottom: '10px',
  fontSize: '1.2rem',
  textAlign: 'center',
  textTransform: 'uppercase',
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
};

const listItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 0',
  borderBottom: '1px solid var(--light-gray)',
  fontSize: '0.95rem',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  marginTop: 'auto',
};

export default CharacterCard;
