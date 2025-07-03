import React, { useEffect, useRef, useState } from 'react';
import '../styles/EventBanner.css';
import BASE_URL from '../config';

function EventBannerSlider() {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/banners`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(item =>
          item.image && item.image.startsWith('https://')
        );
        if (filtered.length === 0) {
          setImages([
            {
              image: 'https://your-default-banner-url.com/default.jpg',
              filename: 'default'
            }
          ]);
        } else {
          setImages(filtered);
        }
      })
      .catch(err => console.error('❌ Banner load failed:', err));
  }, []);

  useEffect(() => {
    if (images.length > 1) {
      startAutoSlide();
    }
    return stopAutoSlide;
  }, [images]);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
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
    setIndex(prev => (prev - 1 + images.length) % images.length);
    startAutoSlide();
  };

  const handleNext = () => {
    stopAutoSlide();
    setIndex(prev => (prev + 1) % images.length);
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
                src={item.image}
                alt={`poster-${item.filename || i}`}
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
