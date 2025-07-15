import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import HeroListPage from './components/HeroListPage';
import Login from './components/Login';
import Signup from './components/Signup';
import DecksPage from './components/DecksPage';
import ComparePage from './components/ComparePage';
import BattlePage from './components/BattlePage';
import EarnTokensPage from './components/EarnTokensPage';
import coin from './coin.png';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <nav>
            <Link to="/">Home</Link>
            <AuthRoutes />
          </nav>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/heroes" 
              element={
                <PrivateRoute>
                  <HeroListPage />
                </PrivateRoute>
              }
            />
            <Route 
              path="/decks" 
              element={
                <PrivateRoute>
                  <DecksPage />
                </PrivateRoute>
              }
            />
            <Route 
              path="/compare" 
              element={
                <PrivateRoute>
                  <ComparePage />
                </PrivateRoute>
              }
            />
            <Route 
              path="/battle" 
              element={
                <PrivateRoute>
                  <BattlePage />
                </PrivateRoute>
              }
            />
            <Route 
              path="/earn-tokens" 
              element={
                <PrivateRoute>
                  <EarnTokensPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const AuthRoutes = () => {
  const { currentUser, logout, tokens } = useAuth();
  return currentUser ? (
    <>
      <Link to="/heroes" style={{ marginLeft: '10px' }}>Heroes</Link>
      <Link to="/decks" style={{ marginLeft: '10px' }}>Decks</Link>
      <Link to="/compare" style={{ marginLeft: '10px' }}>Compare</Link>
      <Link to="/battle" style={{ marginLeft: '10px' }}>Battle</Link>
      <Link to="/earn-tokens" style={{ marginLeft: '10px' }}>Earn Tokens</Link>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
        <img src={coin} alt="coin" style={{ width: '60px', height: '60px', marginRight: '10px' }} />
        <div style={{ fontSize: '24px', fontWeight: 'bold', border: '2px solid black', padding: '5px', borderRadius: '5px', marginRight: '10px' }}>0</div>
        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{tokens}</span>
      </div>
      <button onClick={logout} style={{ marginLeft: '10px' }}>Logout</button>
    </>
  ) : (
    <Link to="/login" style={{ marginLeft: '10px' }}>Login</Link>
  );
}

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

export default App;