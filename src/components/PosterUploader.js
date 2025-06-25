import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PosterUploader = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [banners, setBanners] = useState([]);

  const fetchBanners = () => {
    axios.get('http://localhost:5000/api/banners')
      .then(res => setBanners(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('파일을 선택해주세요');
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('http://localhost:5000/api/upload-banner', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('✅ 포스터 업로드 성공');
      setFile(null);
      setPreviewUrl('');
      fetchBanners(); // 새로고침
    } catch (err) {
      console.error(err);
      alert('❌ 업로드 실패');
    }
  };

  const handleDelete = async (imageUrl) => {
    const filename = imageUrl.split('/').pop();  // 파일명 추출
    try {
      await axios.post('http://localhost:5000/api/delete-banner', { filename });
      alert('🗑 삭제 완료');
      fetchBanners(); // 새로고침
    } catch (err) {
      console.error(err);
      alert('❌ 삭제 실패');
    }
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <h3>🖼 포스터 추가</h3>
      <input type="file" onChange={handleFileChange} />
      {previewUrl && (
        <div>
          <img src={previewUrl} alt="preview" style={{ width: '200px', marginTop: '10px' }} />
        </div>
      )}
      <button onClick={handleUpload}>업로드</button>

      <h4 style={{ marginTop: '30px' }}>📂 기존 포스터 목록</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {banners.map((url, idx) => (
          <div key={idx} style={{ textAlign: 'center' }}>
            <img src={`http://localhost:5000${url}`} alt="banner" style={{ width: '150px' }} />
            <button onClick={() => handleDelete(url)}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PosterUploader;
