import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    Meteor.call('users.create', username, password, (err) => {
      if (err) {
        alert('This username is already taken');
        setUsername('');
        setPassword('');
      } else {
        alert('User created successfully');
        setUsername('');
        setPassword('');
        navigate('/login');
      }
    });
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <div>
        <a href="/login">Уже есть аккаунт? Войти</a>
      </div>
    </div>
  );
};

export default Register;
