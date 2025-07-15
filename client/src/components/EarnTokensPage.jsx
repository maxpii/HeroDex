import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import spideyImage from '../spidey.jpg_large'; // Import the image
import '../App.css';

const EarnTokensPage = () => {
  const [guess, setGuess] = useState('');
  const [character, setCharacter] = useState(null);
  const [message, setMessage] = useState('');
  const { currentUser, tokens, setTokens } = useAuth();

  const fetchRandomCharacter = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/battle/random-heroes');
      const data = await response.json();
      if (data && data.length > 0) {
        setCharacter(data[0]);
        setMessage('');
      }
    } catch (error) {
      console.error("Error fetching random character:", error);
    }
  }, []);

  useEffect(() => {
    fetchRandomCharacter();
  }, [fetchRandomCharacter]);

  const handleGuess = async () => {
    if (guess.toLowerCase() === character.name.toLowerCase()) {
            const newTokens = (tokens || 0) + 100;
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
        setMessage('Correct! You earned a token.');
      } catch (error) {
        console.error("Error updating tokens:", error);
        setMessage('An error occurred while updating your tokens.');
      }
    } else {
      setMessage('Incorrect guess. Try again!');
    }
    setGuess('');
    fetchRandomCharacter();
  };

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div className="earn-tokens-page">
      <h2>Earn Tokens</h2>
      <p>Guess the Marvel character to earn tokens!</p>

      <div className="character-display">
        <img src={character.image.url} alt="Random Marvel Character" className="random-character-image" />
      </div>

      <div className="guess-section">
        <input
          type="text"
          placeholder="Your guess"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        />
        <button onClick={handleGuess}>Guess</button>
      </div>

      {message && <p>{message}</p>}

      <p className="token-count">Your Tokens: {tokens}</p>
    </div>
  );
};

export default EarnTokensPage;
