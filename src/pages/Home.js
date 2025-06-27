import React, { useState, useContext, useEffect } from 'react';
import '../styles/Home.css';
import EventBannerSlider from '../components/EventBannerSlider';
import PosterUploader from '../components/PosterUploader';
import { AuthContext } from '../context/AuthContext';
import BASE_URL from '../config';

const initialPromoCards = [
  { id: 1, title: 'Popular', description: 'Fan favorites of the week!', image: '' },
  { id: 2, title: 'On Sale', description: 'Best deals, just for you!', image: '' },
  { id: 3, title: 'New', description: 'Fresh arrivals you’ll love!', image: '' },
  { id: 4, title: 'Cosmetics', description: 'Glow up with top beauty picks!', image: '' },
  { id: 5, title: 'Sauces', description: 'Turn up the flavor!', image: '' },
  { id: 6, title: 'Ice Cream', description: 'Cool treats for hot days!', image: '' }
];

const Home = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.name === 'admin';
  const [promoCards, setPromoCards] = useState([]);

  const saveCardsToServer = (cards) => {
    fetch(`${BASE_URL}/api/promo-cards`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cards)
    }).catch(err => console.error('Failed to save promo cards:', err));
  };

  useEffect(() => {
    fetch(`${BASE_URL}/api/promo-cards`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setPromoCards(data);
        } else {
          setPromoCards(initialPromoCards);
          saveCardsToServer(initialPromoCards);
        }
      })
      .catch(err => {
        console.error('Failed to load promo cards:', err);
        setPromoCards(initialPromoCards);
        saveCardsToServer(initialPromoCards);
      });
  }, []);

  const handleInputChange = (id, field, value) => {
    const updated = promoCards.map(card =>
      card.id === id ? { ...card, [field]: value } : card
    );
    setPromoCards(updated);
    saveCardsToServer(updated);
  };

  const handleImageUpload = (id, file) => {
    const formData = new FormData();
    formData.append('file', file);

    fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        const updated = promoCards.map(card =>
          card.id === id ? { ...card, image: data.imageUrl } : card
        );
        setPromoCards(updated);
        saveCardsToServer(updated);
      })
      .catch(err => console.error('Image upload failed:', err));
  };

  return (
    <div className="page-wrapper">
      <EventBannerSlider />
      {isAdmin && <PosterUploader />}

      <div className="product-grid">
        {promoCards.map((card) => (
          <div className="product-card" key={card.id}>
            <div className="card-image">
              {card.image ? (
                <img
                  src={card.image.startsWith('http') ? card.image : `${BASE_URL}${card.image}`}
                  alt={card.title}
                />
              ) : (
                <div className="placeholder">No Image</div>
              )}
              {isAdmin && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(card.id, e.target.files[0])}
                />
              )}
            </div>
            <div className="card-text">
              {isAdmin ? (
                <>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleInputChange(card.id, 'title', e.target.value)}
                    placeholder="Title"
                  />
                  <textarea
                    value={card.description}
                    onChange={(e) => handleInputChange(card.id, 'description', e.target.value)}
                    placeholder="Description"
                  />
                </>
              ) : (
                <>
                  <h4>{card.title}</h4>
                  <p>{card.description}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
