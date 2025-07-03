import React, { useState, useEffect, useContext } from 'react';
import '../styles/Home.css';
import EventBannerSlider from '../components/EventBannerSlider';
import PosterUploader from '../components/PosterUploader';
import { AuthContext } from '../context/AuthContext';
import BASE_URL from '../config';

const initialPromoCards = [
  { id: 1, title: 'Popular', description: 'Fan favorites!' },
  { id: 2, title: 'On Sale', description: 'Best deals here!' }
];

const Home = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.name === 'admin';
  const [promoCards, setPromoCards] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/promo-cards`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPromoCards(data);
        } else {
          setPromoCards(initialPromoCards);
          saveCards(initialPromoCards);
        }
      })
      .catch(err => {
        console.error('Failed to load promo cards:', err);
        setPromoCards(initialPromoCards);
      });
  }, []);

  const saveCards = (cards) => {
    fetch(`${BASE_URL}/api/promo-cards`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cards)
    }).catch(err => console.error('Failed to save promo cards:', err));
  };

  const handleChange = (id, field, value) => {
    const updated = promoCards.map(card =>
      card.id === id ? { ...card, [field]: value } : card
    );
    setPromoCards(updated);
    saveCards(updated);
  };

  const handleImageUpload = async (id, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        console.error('Image upload failed.');
        return;
      }

      const data = await res.json();

      const updated = promoCards.map(card =>
        card.id === id ? { ...card, image: data.imageUrl } : card
      );
      setPromoCards(updated);
      saveCards(updated);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <div>
      <EventBannerSlider />

      <h2>🎉 Event Banners</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {promoCards.map((card, i) => (
          <div
            key={card.id || card.filename || i}
            style={{ border: '1px solid #ccc', padding: '10px', maxWidth: '300px' }}
          >
            {isAdmin ? (
              <>
                <input
                  type="text"
                  value={card.title}
                  onChange={e => handleChange(card.id || i, 'title', e.target.value)}
                  placeholder="Title"
                />
                <textarea
                  value={card.description}
                  onChange={e => handleChange(card.id || i, 'description', e.target.value)}
                  placeholder="Description"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleImageUpload(card.id || i, e.target.files[0])}
                />
              </>
            ) : (
              <>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </>
            )}

            {card.image && (
              <img
                src={card.image}
                alt="Banner"
                style={{ width: '200px', marginTop: '10px', borderRadius: '6px' }}
              />
            )}
          </div>
        ))}
      </div>

      {isAdmin && <PosterUploader />}
    </div>
  );
};

export default Home;
