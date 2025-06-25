// src/components/RequireGuest.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function RequireGuest({ children }) {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return null; // 👈 로그인 정보 로딩 중엔 잠시 비워둠

  return user ? <Navigate to="/" /> : children;
}

export default RequireGuest;
