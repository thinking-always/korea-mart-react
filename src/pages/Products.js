import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Products.css';

const categories = [
  'all', 'noodles', 'beverages', 'sides', 'cosmetics', 'sauces', 'snacks', 'ready-meals', 'frozen', 'vegetables', 'cleaning', 'rice', 'daily'
];

function Products() {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState(''); // 🔍 검색 상태 추가

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleImageUpload = (id, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProducts(prev =>
        prev.map(product =>
          product.id === id ? { ...product, image: reader.result } : product
        )
      );
    };
    reader.readAsDataURL(file);
  };

  // ✅ 카테고리 + 검색 필터 동시 적용
  const filteredProducts = products.filter(product => {
    const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="products-page">
      <h2>🛍 All Products</h2>

      {/* 🔍 검색창 */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '0.5rem',
            width: '100%',
            maxWidth: '400px',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        />
      </div>

      <div className="products-layout">
        {/* 왼쪽: 카테고리 */}
        <div className="category-sidebar">
          {categories.map(cat => (
            <button
              key={cat}
              className={selectedCategory === cat ? 'active' : ''}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 오른쪽: 제품 카드 */}
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div className="product-card" key={product.id}>
              <Link to={`/products/${product.id}`} className="card-image">
                {product.image ? (
                  <img src={`http://localhost:5000${product.image}`} alt={product.name} />
                ) : (
                  <div className="placeholder">No Image</div>
                )}
              </Link>
              <div className="card-info">
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <p>{product.price}</p>
                <button onClick={() => addToCart(product)}>🛒 Add to Cart</button>
                {user?.name === 'admin' && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(product.id, e.target.files[0])}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products;
