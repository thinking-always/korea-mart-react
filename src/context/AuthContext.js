import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('koreaMartUser');
    const storedAdmin = localStorage.getItem('koreaMartAdmin');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedAdmin === 'true') {
      setIsAdmin(true);
    }

    // ✅ 관리자 계정이 없으면 자동 등록
    if (!localStorage.getItem('user-admin1234')) {
      localStorage.setItem(
        'user-admin1234',
        JSON.stringify({ name: 'admin', email: 'admin1234', password: '123456' })
      );
    }

    setIsLoading(false);
  }, []);

  const login = (emailOrId) => {
    // ✅ 관리자 로그인 처리
    if (emailOrId === 'admin1234') {
      const adminData = {
        name: 'admin',
        email: 'admin1234',
      };
      setUser(adminData);
      setIsAdmin(true);
      localStorage.setItem('koreaMartUser', JSON.stringify(adminData));
      localStorage.setItem('koreaMartAdmin', 'true');
      return;
    }

    const stored = localStorage.getItem(`user-${emailOrId}`);
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
    setIsAdmin(false);
    localStorage.setItem('koreaMartUser', JSON.stringify(userData));
    localStorage.removeItem('koreaMartAdmin');
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
