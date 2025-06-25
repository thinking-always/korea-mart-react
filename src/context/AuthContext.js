import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('koreaMartUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (name) => {
    const userData = { name };
    setUser(userData);
    localStorage.setItem('koreaMartUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('koreaMartUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
