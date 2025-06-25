// src/pages/Login.js
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const stored = localStorage.getItem(`user-${email}`);
    if (!stored) {
      alert('등록되지 않은 이메일입니다.');
      return;
    }

    const userData = JSON.parse(stored);
    if (userData.password !== password) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    login(email);
    navigate('/');
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>로그인</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.loginBtn}>로그인</button>
        </form>

        <div style={styles.bottomBox}>
          <span style={styles.bottomText}>아직 계정이 없으신가요?</span>
          <button
            onClick={() => navigate('/signup')}
            style={styles.signupBtn}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f8f8',
  },
  card: {
    background: '#fff',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 0 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    boxSizing: 'border-box',
  },
  title: {
    marginBottom: '1.5rem',
    fontSize: '24px',
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  loginBtn: {
    padding: '0.75rem',
    fontSize: '16px',
    backgroundColor: '#ff3d00',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  bottomBox: {
    marginTop: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: '14px',
    color: '#555',
  },
  signupBtn: {
    fontSize: '14px',
    color: '#007bff',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default Login;
