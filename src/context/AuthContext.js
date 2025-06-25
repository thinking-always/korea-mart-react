import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ✅ 여기 안에 넣어야 함

  useEffect(() => {
    const storedUser = localStorage.getItem('koreaMartUser');
    const storedAdmin = localStorage.getItem('koreaMartAdmin');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedAdmin === 'true') {
      setIsAdmin(true);
    }
    setIsLoading(false); // ✅ useEffect 안에서 설정
  }, []);

  const login = (email) => {
    const stored = localStorage.getItem(`user-${email}`);
    if (!stored) {
      alert('등록되지 않은 사용자입니다.');
      return;
    }

    const parsed = JSON.parse(stored);
    const userData = {
      name: parsed.name,
      email: parsed.email,
    };
    setUser(userData);
    localStorage.setItem('koreaMartUser', JSON.stringify(userData));

    if (email === 'admin@koreamart.com') {
      setIsAdmin(true);
      localStorage.setItem('koreaMartAdmin', 'true');
    } else {
      setIsAdmin(false);
      localStorage.removeItem('koreaMartAdmin');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('koreaMartUser');
    localStorage.removeItem('koreaMartAdmin');
  };

  const deleteAccount = () => {
    if (!user || !user.email) return;
    localStorage.removeItem(`user-${user.email}`);
    logout();
  };

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, isLoading, login, logout, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}
