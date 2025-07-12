import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import HeroListPage from './components/HeroListPage';
import Login from './components/Login';
import Signup from './components/Signup';
import SavedHeroesPage from './components/SavedHeroesPage';
import DecksPage from './components/DecksPage';
import ComparePage from './components/ComparePage';
import './App.css';

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
              path="/saved-heroes" 
              element={
                <PrivateRoute>
                  <SavedHeroesPage />
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const AuthRoutes = () => {
  const { currentUser, logout } = useAuth();
  return currentUser ? (
    <>
      <Link to="/heroes" style={{ marginLeft: '10px' }}>Heroes</Link>
      <Link to="/saved-heroes" style={{ marginLeft: '10px' }}>Saved Heroes</Link>
      <Link to="/decks" style={{ marginLeft: '10px' }}>Decks</Link>
      <Link to="/compare" style={{ marginLeft: '10px' }}>Compare</Link>
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