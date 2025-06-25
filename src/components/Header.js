import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

function Header({ isAdmin }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">🛒 Korea Mart</Link>
      </div>
      <nav className="header-right">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>

        {/* ✅ 관리자 전용 메뉴 */}
        {isAdmin && (
          <Link to="/admin" className="nav-link">상품관리</Link>
        )}

        {user ? (
          <>
            <span className="user">👋 {user.name}</span>
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
