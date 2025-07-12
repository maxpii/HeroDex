import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAuth } from 'firebase/auth';
import CharacterCard from './CharacterCard';

const ComparePage = () => {
  const { currentUser } = useAuth();
  const [savedHeroes, setSavedHeroes] = useState([]);
  const [deckHeroes, setDeckHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHero1, setSelectedHero1] = useState(null);
  const [selectedHero2, setSelectedHero2] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const idToken = await getAuth().currentUser.getIdToken();
        
        // Fetch Saved Heroes
        const savedResponse = await fetch('http://localhost:5000/api/savedHeroes', {
          headers: { 'Authorization': `Bearer ${idToken}` },
        });
        if (!savedResponse.ok) throw new Error(`HTTP error! status: ${savedResponse.status}`);
        const savedData = await savedResponse.json();
        setSavedHeroes(savedData);

        // Fetch Deck Heroes
        const deckResponse = await fetch('http://localhost:5000/api/deck', {
          headers: { 'Authorization': `Bearer ${idToken}` },
        });
        if (!deckResponse.ok) throw new Error(`HTTP error! status: ${deckResponse.status}`);
        const deckData = await deckResponse.json();
        setDeckHeroes(deckData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleCompare = () => {
    if (!selectedHero1 || !selectedHero2) {
      alert("Please select two heroes to compare.");
      return;
    }

    const stats = ['intelligence', 'strength', 'speed', 'durability', 'power', 'combat'];
    let hero1Wins = 0;
    let hero2Wins = 0;

    const comparison = stats.map(stat => {
      const stat1 = parseInt(selectedHero1.powerstats[stat] || 0);
      const stat2 = parseInt(selectedHero2.powerstats[stat] || 0);
      let winner = 'Tie';
      if (stat1 > stat2) {
        winner = selectedHero1.name;
        hero1Wins++;
      } else if (stat2 > stat1) {
        winner = selectedHero2.name;
        hero2Wins++;
      }
      return { stat, stat1, stat2, winner };
    });

    let overallWinner = 'It\'s a tie!';
    if (hero1Wins > hero2Wins) {
      overallWinner = `${selectedHero1.name} wins!`;
    } else if (hero2Wins > hero1Wins) {
      overallWinner = `${selectedHero2.name} wins!`;
    }

    setComparisonResult({ comparison, overallWinner });
  };

  if (loading) return <div>Loading heroes for comparison...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentUser) return <div>Please log in to use the Compare feature.</div>;

  const allAvailableHeroes = [...savedHeroes, ...deckHeroes].reduce((acc, current) => {
    const x = acc.find(item => item.id === current.id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  return (
    <div>
      <h1>Compare Heroes</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h2>Hero 1</h2>
          <select onChange={(e) => setSelectedHero1(allAvailableHeroes.find(hero => hero.id === e.target.value))}>
            <option value="">Select Hero 1</option>
            {allAvailableHeroes.map(hero => (
              <option key={hero.id} value={hero.id}>{hero.name}</option>
            ))}
          </select>
          {selectedHero1 && <CharacterCard character={selectedHero1} context="compare" />}
        </div>
        <div>
          <h2>Hero 2</h2>
          <select onChange={(e) => setSelectedHero2(allAvailableHeroes.find(hero => hero.id === e.target.value))}>
            <option value="">Select Hero 2</option>
            {allAvailableHeroes.map(hero => (
              <option key={hero.id} value={hero.id}>{hero.name}</option>
            ))}
          </select>
          {selectedHero2 && <CharacterCard character={selectedHero2} context="compare" />}
        </div>
      </div>
      <button onClick={handleCompare}>Compare!</button>
      {comparisonResult && (
        <div style={{ marginTop: '20px' }}>
          <h3>Comparison Result</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>Stat</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>{selectedHero1.name}</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>{selectedHero2.name}</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Winner</th>
              </tr>
            </thead>
            <tbody>
              {comparisonResult.comparison.map(row => (
                <tr key={row.stat}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{row.stat}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{row.stat1}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{row.stat2}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{row.winner}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 style={{ textAlign: 'center', marginTop: '20px' }}>{comparisonResult.overallWinner}</h2>
        </div>
      )}
    </div>
  );
};

export default ComparePage;