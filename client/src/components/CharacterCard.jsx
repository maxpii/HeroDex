import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getAuth } from 'firebase/auth';
import '../App.css';

function CharacterCard({ character, context, onRemove }) {
  const { currentUser } = useAuth();

  const handleSaveHero = async () => {
    if (!currentUser) return alert("You must be logged in to save heroes.");
    // ... (rest of the function is unchanged)
  };

  const handleAddToDeck = async () => {
    if (!currentUser) return alert("You must be logged in to add to your deck.");
    // ... (rest of the function is unchanged)
  };

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
      {currentUser && (
        <div style={buttonContainerStyle}>
          {context === 'heroes' && (
            <>
              <button onClick={handleSaveHero} style={{ marginRight: '10px' }}>Save Hero</button>
              <button onClick={handleAddToDeck}>Add to Deck</button>
            </>
          )}
          {context === 'saved' && <button onClick={() => onRemove(character.id)}>Remove</button>}
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
