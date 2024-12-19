"use client";
import '../styles/login.css'; // Adjust the path to where your CSS file is located

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // For navigation between pages

export default function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Initialize the router for redirection

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!login || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      if (response.ok) {
        const result = await response.json();
        // Pass the user data to the TestSer page via query parameters
        router.push(`/testSer?data=${encodeURIComponent(JSON.stringify(result.data))}`);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          placeholder="Login"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="message">{error}</p>}
    </div>
  );
}
