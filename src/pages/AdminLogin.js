import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css'; // ✅ 스타일 연결

const AdminLogin = ({ setIsAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '1234') {
      setIsAdmin(true);
      navigate('/admin');
    } else {
      alert('로그인 실패! 아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <form className="admin-login-form" onSubmit={handleLogin}>
      <h2>🔐 관리자 로그인</h2>
      <input
        type="text"
        placeholder="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">로그인</button>
    </form>
  );
};

export default AdminLogin;
