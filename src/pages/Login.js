import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() !== '') {
      login(username);
      navigate('/');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your nickname"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit" style={{ marginLeft: '1rem' }}>Login</button>
      </form>
    </div>
  );
}

export default Login;
