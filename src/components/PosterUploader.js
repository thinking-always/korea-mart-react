import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../config'; // ✅ 환경별 URL 처리

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
      .catch(err => console.error(err));
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
      console.error(err);
      alert('❌ 업로드 실패');
    }
  };

  const handleDelete = async (imageUrl) => {
    const filename = imageUrl.split('/').pop();
    try {
      await axios.post(`${BASE_URL}/api/delete-banner`, { filename });
      alert('🗑 삭제 완료');
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert('❌ 삭제 실패');
    }
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <h3>🖼 포스터 추가</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && (
        <div>
          <img src={previewUrl} alt="preview" style={{ width: '300px', marginTop: '10px' }} />
        </div>
      )}
      <button onClick={handleUpload}>업로드</button>

      <h4 style={{ marginTop: '30px' }}>📂 기존 포스터 목록</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {banners.map((url, idx) => (
          <div key={idx} style={{ textAlign: 'center' }}>
            <img src={`${BASE_URL}${url}`} alt="banner" style={{ width: '150px' }} />
            <button onClick={() => handleDelete(url)}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PosterUploader;
