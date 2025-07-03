import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../config';

const PosterUploader = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = () => {
    axios
      .get(`${BASE_URL}/api/banners`)
      .then(res => setBanners(res.data))
      .catch(err => console.error('🔴 배너 불러오기 실패:', err));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(selected);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('파일을 선택하세요!');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${BASE_URL}/api/upload-banner`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('✅ 업로드 성공!');
      setFile(null);
      setPreviewUrl('');
      fetchBanners();
    } catch (err) {
      console.error('❌ 업로드 실패:', err);
      alert('❌ 업로드 실패');
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`삭제하시겠습니까? ${filename}`)) return;
    try {
      await axios.post(`${BASE_URL}/api/delete-banner`, { filename });
      alert('🗑 삭제 완료!');
      fetchBanners();
    } catch (err) {
      console.error('❌ 삭제 실패:', err);
      alert('❌ 삭제 실패');
    }
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h3>🖼 새 배너 업로드</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && (
        <div style={{ marginTop: '10px' }}>
          <img src={previewUrl} alt="preview" style={{ width: '250px' }} />
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={!file}
        style={{
          marginTop: '10px',
          padding: '6px 12px',
          backgroundColor: file ? '#007bff' : '#ccc',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: file ? 'pointer' : 'not-allowed'
        }}
      >
        업로드
      </button>

      <h4 style={{ marginTop: '30px' }}>📂 현재 배너</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        {banners.map((banner, i) => (
          <div key={banner.filename || i} style={{
            width: '160px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '10px',
            textAlign: 'center'
          }}>
            <img
              src={banner.image}
              alt={`poster-${banner.filename || i}`}
              style={{ width: '100%', borderRadius: '5px' }}
            />
            <p style={{ fontSize: '12px', wordBreak: 'break-word' }}>{banner.filename}</p>
            <button
              onClick={() => handleDelete(banner.filename)}
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                backgroundColor: '#ff3d00',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '6px'
              }}
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PosterUploader;
