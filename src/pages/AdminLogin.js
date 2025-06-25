// src/pages/AdminLogin.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === 'admin') {
      login('admin');
      navigate('/admin');
    } else {
      alert('관리자 이름은 "admin"이어야 합니다.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>관리자 로그인</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="관리자 이름 입력"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit" style={{ marginLeft: '1rem' }}>Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
