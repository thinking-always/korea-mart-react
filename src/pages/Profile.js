// src/pages/Profile.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>프로필</h2>
        <p><strong>닉네임:</strong> {user.name}</p>
        <p><strong>이메일:</strong> {user.email}</p>

        <button
          style={styles.logoutBtn}
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          로그아웃
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
    textAlign: 'center',
  },
  title: {
    marginBottom: '1.5rem',
    fontSize: '24px',
    color: '#333',
  },
  logoutBtn: {
    marginTop: '1.5rem',
    padding: '0.75rem 1.5rem',
    fontSize: '16px',
    backgroundColor: '#888',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  }
};

export default Profile;
