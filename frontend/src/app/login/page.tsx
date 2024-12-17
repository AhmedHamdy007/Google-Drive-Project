"use client"; 
import { useState } from 'react';
import '../styles/login.css';


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setMessage("Please fill in both fields.");
      return;
    }

    try {
      // Send request to Express backend at port 5000
      const response = await fetch('http://localhost:5000/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: username, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Authenticated! Session ID: ${data.sessionId}`);
      } else {
        setMessage('Authentication failed. Check your credentials.');
      }
    } catch (error) {
      setMessage('An error occurred: ' + (error as Error).message);
    }
  };

  return (<div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} aria-label="Login Form">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}