import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import '../styles/Cart.css';

function Cart() {
  const { cartItems, updateQuantity, setCartItems } = useContext(CartContext);

  const getTotal = () => {
    return cartItems.reduce((acc, item) => {
      const priceNum = parseFloat(item.price.replace('$', ''));
      return acc + priceNum * item.quantity;
    }, 0).toFixed(2);
  };

  const handleOrder = () => {
    alert('주문이 완료되었습니다!');
    setCartItems([]);
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                <div className="cart-item">
                  <span>{item.name}</span>
                  <span>{item.price}</span>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total">Total: ${getTotal()}</div>
          <div className="cart-order">
            <button onClick={handleOrder}>🛒 주문하기</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
