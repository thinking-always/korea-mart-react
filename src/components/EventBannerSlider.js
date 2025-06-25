// src/components/EventBannerSlider.jsx
import React, { useEffect, useRef, useState } from 'react';
import '../styles/EventBanner.css';
import axios from 'axios';

function EventBannerSlider() {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/banners')
      .then(res => setImages(res.data))
      .catch(err => console.error('포스터 불러오기 실패', err));
  }, []);

  useEffect(() => {
    if (images.length > 1) {
      intervalRef.current = setInterval(() => {
        setIndex(prev => (prev + 1) % images.length);
      }, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [images]);

  const handlePrev = () => {
    clearInterval(intervalRef.current);
    setIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    clearInterval(intervalRef.current);
    setIndex(prev => (prev + 1) % images.length);
  };

  if (images.length === 0) {
    return <div style={{ textAlign: 'center', padding: '30px' }}>포스터가 없습니다</div>;
  }

  return (
    <div className="slider-container">
      <button className="slide-btn left" onClick={handlePrev}>◀</button>
      <div className="slider-wrapper">
        <div
          className="slider-track"
          style={{
            transform: `translateX(-${index * 100}%)`,
            width: `${images.length * 100}%`,
            transition: 'transform 1s ease-in-out'
          }}
        >
          {images.map((url, i) => (
            <div className="slider-item" key={i}>
              <img
                src={`http://localhost:5000${url}`}
                alt={`poster-${i}`}
                className="poster-image"
              />
            </div>
          ))}
        </div>
      </div>
      <button className="slide-btn right" onClick={handleNext}>▶</button>
    </div>
  );
}

export default EventBannerSlider;
