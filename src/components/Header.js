// src/components/Header.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

function Header({ isAdmin }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        {/* 👤 프로필 버튼 (로그인한 경우만) */}
        {user && (
          <button
            onClick={() => navigate('/profile')}
            className="profile-btn"
            style={{ marginRight: '1rem', fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            👤 {user.name}
          </button>
        )}
        <Link to="/" className="logo">🛒 Korea Mart</Link>
      </div>

      <nav className="header-right">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
        
        {isAdmin && (
          <Link to="/admin" className="nav-link">상품관리</Link>
        )}

        {user ? (
          <>
            <button onClick={logout} className="logout">Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
