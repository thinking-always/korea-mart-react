// src/components/Header.js
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { user, logout } = useContext(AuthContext);
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

  const dropdownItemStyle = {
    whiteSpace: 'nowrap',
    padding: '0.5rem 1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'block',
    width: '100%',
    textAlign: 'left'
  };

  return (
    <header className="header">
      {/* 왼쪽: 로고 */}
      <div className="header-left">
        <Link to="/" className="logo">🛒 Korea Mart</Link>
      </div>

      {/* 오른쪽: 모든 메뉴 */}
      <nav className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: 'auto' }}>
        <Link to="/">Home</Link>
        <Link to="/products">제품</Link>
        <Link to="/cart">장바구니</Link>

        {/* 프로필 드롭다운 */}
        {user && (
          <div className="profile-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="profile-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              👤
            </button>
            {dropdownOpen && (
              <div
                className="dropdown-menu"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                  zIndex: 999,
                  minWidth: '120px'
                }}
              >
                <button
                  onClick={() => {
                    navigate('/profile');
                    setDropdownOpen(false);
                  }}
                  style={dropdownItemStyle}
                >
                  내 정보
                </button>
                <button
                  onClick={() => {
                    navigate('/cart');
                    setDropdownOpen(false);
                  }}
                  style={dropdownItemStyle}
                >
                  장바구니
                </button>
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  style={dropdownItemStyle}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        )}

        {/* 비로그인 시 로그인 버튼 */}
        {!user && (
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff' }}
          >
            로그인
          </button>
        )}

        {/* 로그인 시 추가 로그아웃 버튼 */}
        {user && (
          <button
            onClick={logout}
            className="logout"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#fff',
              fontWeight: 'bold'
            }}
          >
            로그아웃
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
