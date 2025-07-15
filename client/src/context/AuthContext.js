import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase'; // Import the auth instance from your firebase.js
import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [tokens, setTokens] = useState(0);
  const [loading, setLoading] = useState(true);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }

  const logout = () => {
    return signOut(auth);
  }

  const fetchTokens = async (user) => {
    if (user) {
      try {
        const token = await user.getIdToken();
        const response = await fetch("http://localhost:5000/api/user/tokens", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setTokens(data.tokens);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      }
    }
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        fetchTokens(user);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    tokens,
    setTokens, // Add this
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
