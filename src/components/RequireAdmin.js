// src/components/RequireAdmin.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function RequireAdmin({ children }) {
  const { isAdmin, isLoading } = useContext(AuthContext);

  if (isLoading) return null; // 로딩 중이면 아무것도 렌더하지 않음
  return isAdmin ? children : <Navigate to="/admin-login" />;
}

export default RequireAdmin;
