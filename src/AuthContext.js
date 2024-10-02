// src/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    // Fetch current user
    axios
      .get(`${apiUrl}/auth/user`, { withCredentials: true })
      .then(response => {
        setUser(response.data);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};
