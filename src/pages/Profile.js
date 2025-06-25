// src/pages/Profile.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, logout, deleteAccount } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDelete = () => {
    const confirmDelete = window.confirm('정말 회원 탈퇴하시겠습니까?');
    if (confirmDelete) {
      deleteAccount();
      navigate('/');
    }
  };

  if (!user) {
    return <p style={{ padding: '2rem' }}>로그인이 필요합니다.</p>;
  }

  return (
    <div style={styles.container}>
      <h2>프로필</h2>
      <p><strong>닉네임:</strong> {user.name}</p>
      <p><strong>이메일:</strong> {user.email}</p>
      <div style={styles.buttonRow}>
        <button onClick={logout} style={styles.logout}>로그아웃</button>
        <button onClick={handleDelete} style={styles.delete}>회원 탈퇴</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '500px',
    margin: 'auto',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 12px rgba(0,0,0,0.1)',
  },
  buttonRow: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
  logout: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#555',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  delete: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#ff3d00',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  }
};

export default Profile;
