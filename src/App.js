import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';      // ✅ 추가
import AdminPage from './pages/AdminPage';        // ✅ 추가
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import './index.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);  // ✅ 관리자 상태 추가

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header isAdmin={isAdmin} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            
            {/* ✅ 관리자 전용 경로 */}
            <Route path="/admin-login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
            <Route
              path="/admin"
              element={isAdmin ? <AdminPage /> : <Navigate to="/admin-login" />}
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
