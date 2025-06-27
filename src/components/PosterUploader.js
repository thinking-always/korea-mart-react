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
    axios.get(`${BASE_URL}/api/banners`)
      .then(res => setBanners(res.data))
      .catch(err => console.error('🔴 배너 불러오기 실패:', err));
  };

  const resizeImageTo16x9 = (file, callback) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const width = 1280;
        const height = 720;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, width, height);

        const ratio = Math.min(width / img.width, height / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;
        const offsetX = (width - newWidth) / 2;
        const offsetY = (height - newHeight) / 2;
        ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

        canvas.toBlob((blob) => {
          if (!blob) {
            alert("이미지 변환 실패");
            return;
          }
          const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
          callback(resizedFile, canvas.toDataURL('image/jpeg'));
        }, 'image/jpeg', 0.9);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      resizeImageTo16x9(selected, (resizedFile, preview) => {
        setFile(resizedFile);
        setPreviewUrl(preview);
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('파일을 선택해주세요');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${BASE_URL}/api/upload-banner`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('✅ 포스터 업로드 성공');
      setFile(null);
      setPreviewUrl('');
      fetchBanners();
    } catch (err) {
      console.error('❌ 업로드 에러:', err);
      alert('❌ 업로드 실패');
    }
  };

  const handleDelete = async (filename) => {
    const confirmDelete = window.confirm(`🗑 포스터를 삭제하시겠습니까?\n${filename}`);
    if (!confirmDelete) return;

    try {
      await axios.post(`${BASE_URL}/api/delete-banner`, { filename });
      alert('🗑 삭제 완료');
      fetchBanners();
    } catch (err) {
      console.error('❌ 삭제 실패:', err);
      alert('❌ 삭제 실패');
    }
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <h3>🖼 포스터 추가</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {file && <p style={{ fontSize: '13px', marginTop: '5px' }}>선택된 파일: {file.name}</p>}

      {previewUrl && (
        <div style={{ marginTop: '10px' }}>
          <img src={previewUrl} alt="preview" style={{ width: '250px', borderRadius: '8px' }} />
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={!file}
        style={{
          marginTop: '10px',
          padding: '6px 12px',
          backgroundColor: file ? '#007bff' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: file ? 'pointer' : 'not-allowed'
        }}
      >
        업로드
      </button>

      <h4 style={{ marginTop: '30px' }}>📂 기존 포스터 목록</h4>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        marginTop: '10px'
      }}>
        {banners
          .filter(b => b.url && !b.url.includes('banner-')) // 🔥 로컬 이미지 제거
          .map((banner) => (
            <div key={banner.filename} style={{
              width: '160px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '10px',
              textAlign: 'center',
              backgroundColor: '#fafafa',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <img
                src={banner.url}
                alt={`poster-${banner.filename}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '5px',
                  marginBottom: '6px'
                }}
              />
              <p style={{
                fontSize: '12px',
                wordBreak: 'break-word',
                margin: '6px 0'
              }}>{banner.filename}</p>
              <button
                onClick={() => handleDelete(banner.filename)}
                style={{
                  fontSize: '12px',
                  padding: '3px 8px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#ff3d00',
                  color: 'white',
                  cursor: 'pointer'
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
