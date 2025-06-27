import React, { useEffect, useRef, useState } from 'react';
import '../styles/EventBanner.css';
import axios from 'axios';
import BASE_URL from '../config';

function EventBannerSlider() {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  // ✅ Cloudinary 이미지만 불러오기
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/banners`)
      .then((res) => {
        const filtered = res.data.filter(item =>
          item.url && item.url.startsWith('https://res.cloudinary.com')
        );
        setImages(filtered);
        setIndex(0); // 🔧 이미지 갱신되면 index도 초기화
      })
      .catch((err) => console.error('포스터 불러오기 실패', err));
  }, []);

  // ✅ 자동 슬라이드 타이머
  useEffect(() => {
    if (images.length > 1) {
      startAutoSlide();
    }
    return stopAutoSlide;
  }, [images]);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handlePrev = () => {
    stopAutoSlide();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
    startAutoSlide(); // 수동 조작 후 다시 자동 재시작
  };

  const handleNext = () => {
    stopAutoSlide();
    setIndex((prev) => (prev + 1) % images.length);
    startAutoSlide();
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
          {images.map((item, i) => (
            <div className="slider-item" key={item.filename || i}>
              <img
                src={item.url}
                alt={item.filename || `poster-${i}`}
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
