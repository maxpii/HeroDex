import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CharacterCard from './CharacterCard';

const BattlePage = () => {
  const [hero1, setHero1] = useState(null);
  const [hero2, setHero2] = useState(null);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHeroes = async () => {
    setLoading(true);
    setError('');
    setHero1(null);
    setHero2(null);
    setWinner(null);
    try {
      const response = await axios.get('http://localhost:5000/api/battle/random-heroes');
      if (response.data.length === 2) {
        setHero1(response.data[0]);
        setHero2(response.data[1]);
      } else {
        setError('Could not fetch two heroes. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching heroes:', err);
      setError('Failed to fetch heroes. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const startBattle = () => {
    if (!hero1 || !hero2) return;

    const hero1Power = parseInt(hero1.powerstats.power) || 0;
    const hero2Power = parseInt(hero2.powerstats.power) || 0;

    if (hero1Power > hero2Power) {
      setWinner(hero1);
    } else if (hero2Power > hero1Power) {
      setWinner(hero2);
    } else {
      setWinner({ name: 'It\'s a draw!' });
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Hero Battle</h1>
      <button onClick={fetchHeroes} disabled={loading} style={{ marginBottom: '20px' }}>
        {loading ? 'Fetching Heroes...' : 'Get New Opponents'}
      </button>
      <button onClick={startBattle} disabled={!hero1 || !hero2 || winner} style={{ marginLeft: '10px', marginBottom: '20px' }}>
        Start Battle
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {hero1 && (
          <div style={{ margin: '10px' }}>
            <h2>{hero1.name}</h2>
            <CharacterCard character={hero1} />
          </div>
        )}
        {hero2 && (
          <div style={{ margin: '10px' }}>
            <h2>{hero2.name}</h2>
            <CharacterCard character={hero2} />
          </div>
        )}
      </div>

      {winner && (
        <div style={{ marginTop: '30px' }}>
          <h2>Winner: {winner.name}</h2>
        </div>
      )}
    </div>
  );
};

export default BattlePage;