import React, { useState, useEffect } from 'react';
import '../styles/Admin.css';
import axios from 'axios';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    image: '',
    category: '',
    description: '',
    filename: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price.trim() || !category.trim()) {
      return alert('모든 필수 항목을 입력해주세요');
    }

    const newProduct = { name, price, image, category, description };
    try {
      const res = await axios.post('http://localhost:5000/api/products', newProduct);
      setProducts([...products, res.data]);
      setName(''); setPrice(''); setImage(''); setCategory(''); setDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImage(res.data.imageUrl);
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
    }
  };

  const openEditPopup = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description || '',
      filename: product.image ? product.image.split('/').pop() : ''
    });
  };

  const handleEditChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleEditImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setEditForm({ ...editForm, image: res.data.imageUrl, filename: res.data.filename });
    } catch (err) {
      console.error('수정 이미지 업로드 실패:', err);
    }
  };

  const handleEditSave = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, editForm);
      setProducts(products.map(p => p.id === editingProduct.id ? res.data : p));
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-layout">
      <div className="product-list-panel">
        <h2>📦 등록된 상품</h2>
        <div className="product-list">
          {products.map(product => (
            <div className="product-row" key={product.id}>
              <img src={`http://localhost:5000${product.image}`} alt={product.name} className="row-image" />
              <div className="row-info">
                <strong>{product.name}</strong> | {product.price} | [{product.category}]
              </div>
              <button onClick={() => openEditPopup(product)}>수정</button>
              <button onClick={() => handleDelete(product.id)}>삭제</button>
            </div>
          ))}
        </div>
      </div>

      <div className="product-form-panel">
        <h2>➕ 상품 추가</h2>
        <form className="product-form" onSubmit={handleAddProduct}>
          <input type="text" placeholder="상품명" value={name} onChange={e => setName(e.target.value)} />
          <input type="text" placeholder="가격" value={price} onChange={e => setPrice(e.target.value)} />
          <input type="file" onChange={handleImageUpload} />
          {image && <img src={`http://localhost:5000${image}`} alt="미리보기" style={{ width: '100px' }} />}
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">카테고리 선택</option>
            <option value="noodles">noodles</option>
            <option value="beverages">beverages</option>
            <option value="sides">sides</option>
            <option value="cosmetics">cosmetics</option>
            <option value="sauces">sauces</option>
            <option value="snacks">snacks</option>
            <option value="ready-meals">ready-meals</option>
            <option value="frozen">frozen</option>
            <option value="vegetables">vegetables</option>
            <option value="cleaning">cleaning</option>
            <option value="rice">rice</option>
            <option value="daily">daily</option>
          </select>

          <textarea placeholder="설명 (선택)" value={description} onChange={e => setDescription(e.target.value)} />
          <button type="submit">상품 추가</button>
        </form>
      </div>

      {editingProduct && (
        <div className="popup-overlay">
          <div className="edit-popup-card">
            <h3>상품 수정</h3>
            <div className="edit-preview-image">
              <img src={`http://localhost:5000${editForm.image}`} alt="미리보기" style={{ width: '300px', height: 'auto', marginBottom: '10px' }} />
            </div>
            <p>현재 파일: {editForm.filename}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <input type="file" onChange={handleEditImageUpload} />
            </div>
            <input type="text" placeholder="상품명" value={editForm.name} onChange={e => handleEditChange('name', e.target.value)} />
            <input type="text" placeholder="가격" value={editForm.price} onChange={e => handleEditChange('price', e.target.value)} />
            <select value={editForm.category} onChange={e => handleEditChange('category', e.target.value)}>
              <option value="">카테고리 선택</option>
              <option value="noodles">noodles</option>
              <option value="beverages">beverages</option>
              <option value="sides">sides</option>
              <option value="cosmetics">cosmetics</option>
              <option value="sauces">sauces</option>
              <option value="snacks">snacks</option>
              <option value="ready-meals">ready-meals</option>
              <option value="frozen">frozen</option>
              <option value="vegetables">vegetables</option>
              <option value="cleaning">cleaning</option>
              <option value="rice">rice</option>
              <option value="daily">daily</option>
            </select>

            <textarea placeholder="설명 (선택)" value={editForm.description} onChange={e => handleEditChange('description', e.target.value)} />
            <div className="popup-buttons">
              <button onClick={handleEditSave}>저장</button>
              <button onClick={() => setEditingProduct(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
