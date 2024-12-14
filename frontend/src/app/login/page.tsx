"use client"; 
import { useState } from 'react';
import '../styles/login.css';


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

  return (
    <div>
    <h2 style={{ color: '#4CAF50' }}>Login</h2> {/* Font color for heading */}
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username" style={{ color: '#555' }}>Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password" style={{ color: '#555' }}>Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
    <p style={{ color: message.startsWith('Authenticated') ? '#4CAF50' : 'red' }}>
      {message}
    </p>
  </div>
  );
}
