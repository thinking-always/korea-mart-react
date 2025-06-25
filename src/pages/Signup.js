// src/pages/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirm) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    if (password.length < 6) {
      alert('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!passwordRegex.test(password)) {
      alert('비밀번호는 영문과 숫자를 반드시 포함해야 합니다.');
      return;
    }

    if (password !== confirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const existing = localStorage.getItem(`user-${email}`);
    if (existing) {
      alert('이미 가입된 이메일입니다.');
      return;
    }

    const userData = { name, email, password };
    localStorage.setItem(`user-${email}`, JSON.stringify(userData));
    alert('회원가입이 완료되었습니다!');
    navigate('/login');
  };
  

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>회원가입</h2>
        <form onSubmit={handleSignup} style={styles.form}>
          <input
            type="text"
            placeholder="사용자 이름 (닉네임)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="email"
            placeholder="이메일"
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
          <small style={styles.hint}>
            ※ 비밀번호에는 <strong>영문</strong>과 <strong>숫자</strong>가 반드시 포함되어야 합니다.
          </small>
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>가입하기</button>
        </form>

        <div style={styles.bottomBox}>
          <span style={styles.bottomText}>이미 계정이 있으신가요?</span>
          <button
            onClick={() => navigate('/login')}
            style={styles.linkBtn}
          >
            로그인
          </button>
        </div>

        {/* ⬅️ 돌아가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          style={styles.backBtn}
        >
          ← 돌아가기
        </button>
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
  hint: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: '-0.5rem',
    marginBottom: '0.5rem',
  },
  button: {
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
  linkBtn: {
    fontSize: '14px',
    color: '#007bff',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  backBtn: {
    marginTop: '1.5rem',
    fontSize: '14px',
    color: '#666',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default Signup;
