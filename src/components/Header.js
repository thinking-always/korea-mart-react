import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';
import logo from '../assets/logo.png';

function Header() {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          <img
            src={logo}
            alt="Korea Mart Logo"
          />
        </Link>
      </div>

      <nav className="header-right">
        <Link to="/">Home</Link>
        <Link to="/products">제품</Link>
        <Link to="/cart">장바구니</Link>
        {isAdmin && <Link to="/admin" className="admin-link">상품관리</Link>}

        {user ? (
          <div className="profile-wrapper" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="profile-btn"
            >
              👤
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setDropdownOpen(false);
                  }}
                >
                  내 정보
                </button>
                <button
                  onClick={() => {
                    navigate('/cart');
                    setDropdownOpen(false);
                  }}
                >
                  장바구니
                </button>
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="logout-btn"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="login-btn"
          >
            로그인
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
