// src/config.js
const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : 'https://korea-mart-backend.onrender.com'; // ← 너의 백엔드 주소

  

export default BASE_URL;
