import React, { useState } from 'react';
import "./App.css"

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, confirm_password: confirmPassword }),
      });
      const data = await response.json();
      alert(data.message);
      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/';
  };

  return (
    <div className="login-container">
      <div className="login-form">
      <header className="App-header">
        <h1>Register</h1>
        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Re-enter Password:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="show-password"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="show-password">Show Password</label>
          </div>
          <div className="form-group">
            <label>Administrator's code:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="admin-code"
              required
            />
          </div>
          <button type="submit" className="button login-button">
            Register
          </button>
        </form>
        <button onClick={navigateToLogin} className="button register-button">
          Back to Login
        </button>
      </header>
    </div>
    </div>
  );
}

export default Register;
