// src/pages/Home.jsx
import React, { useState, useContext } from 'react';
import '../styles/Home.css';
import EventBannerSlider from '../components/EventBannerSlider';
import PosterUploader from '../components/PosterUploader';
import { AuthContext } from '../context/AuthContext';

const initialProducts = [
  { id: 1, name: 'Product 1', description: 'Description 1', image: '' },
  { id: 2, name: 'Product 2', description: 'Description 2', image: '' },
  { id: 3, name: 'Product 3', description: 'Description 3', image: '' },
  { id: 4, name: 'Product 4', description: 'Description 4', image: '' },
  { id: 5, name: 'Product 5', description: 'Description 5', image: '' },
  { id: 6, name: 'Product 6', description: 'Description 6', image: '' },
];

const Home = () => {
  const [products, setProducts] = useState(initialProducts);
  const { user } = useContext(AuthContext);
  const isAdmin = user?.name === 'admin';

  const handleInputChange = (id, field, value) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

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

  return (
    <div className="page-wrapper">
      <EventBannerSlider />

      {isAdmin && <PosterUploader />}

      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="card-image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="placeholder">No Image</div>
              )}
              {isAdmin && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(product.id, e.target.files[0])}
                />
              )}
            </div>
            <div className="card-text">
              {isAdmin ? (
                <>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleInputChange(product.id, 'name', e.target.value)}
                    placeholder="Name"
                  />
                  <textarea
                    value={product.description}
                    onChange={(e) => handleInputChange(product.id, 'description', e.target.value)}
                    placeholder="Description"
                  />
                </>
              ) : (
                <>
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
