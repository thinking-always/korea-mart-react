// src/pages/AdminLogin.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const { login } = useContext(AuthContext);
  const [adminId, setAdminId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ✅ 고정된 관리자 ID
    if (adminId.trim() === 'admin1234') {
      login('admin1234');         // context 로그인 처리
      navigate('/admin');         // ✅ 로그인 후 관리자 페이지로 이동
    } else {
      alert('관리자 아이디는 "admin1234"여야 합니다.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>관리자 로그인</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="관리자 아이디 입력"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          required
        />
        <button type="submit" style={{ marginLeft: '1rem' }}>Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
