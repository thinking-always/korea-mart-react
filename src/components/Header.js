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
            style={{ width: '100px', height: '60px', objectFit: 'contain' }}
          />
        </Link>


      </div>
      <nav className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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
                  style={{ whiteSpace: 'nowrap', padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'left' }}
                >
                  내 정보
                </button>
                <button
                  onClick={() => {
                    navigate('/cart');
                    setDropdownOpen(false);
                  }}
                  style={{ whiteSpace: 'nowrap', padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'left' }}
                >
                  장바구니
                </button>
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  style={{ whiteSpace: 'nowrap', padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'left', color: 'red' }}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        )}

        <Link to="/">Home</Link>
        <Link to="/products">제품</Link>
        <Link to="/cart">장바구니</Link>
        {isAdmin && <Link to="/admin" style={{ fontWeight: 'bold', color: '#111' }}>상품관리</Link>}

        {!user && (
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff' }}
          >
            로그인
          </button>
        )}

        {/* ✅ 드롭다운과는 별도로 오른쪽에 항상 보이는 로그아웃 버튼 */}
        {user && (
          <button
            onClick={logout}
            className="logout"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111', fontWeight: 'bold' }}
          >
            로그아웃
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
