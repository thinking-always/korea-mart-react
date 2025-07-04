import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProductDetail.css';
import BASE_URL from '../config';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/products`)
      .then(res => {
        const found = res.data.find(p => String(p.id) === id);
        setProduct(found);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p>상품을 불러오는 중...</p>;

  return (
    <div className="page-wrapper">
      <div className="detail-container">
        <div className="detail-top-bar">
          <Link to="/" className="back-link">← 뒤로가기</Link>
        </div>

        <div className="detail-main">
          <img
            src={product.image?.startsWith('http') ? product.image : `${BASE_URL}${product.image}`}
            alt={product.name}
            className="detail-image"
          />

          <div className="detail-info">
            <h2 className="detail-name">{product.name}</h2>
            <p className="detail-price">{product.price} 원</p>
            <button className="add-to-cart">장바구니에 담기</button>
          </div>
        </div>

        {product.description && (
          <div className="detail-description">
            <h4>📝 상품 설명</h4>
            <p>{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
