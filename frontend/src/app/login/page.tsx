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
        console.log("Login response:", result);  // Log the response from the backend
       
        // Extract user data and matric number
        const userData = result.data; // Assuming `result.data` contains user information
        const noMatrik = result.data.login_name; // Adjust this field based on your backend response

        // Save the user data and matric number in sessionStorage
        sessionStorage.setItem("userData", JSON.stringify(userData));
        sessionStorage.setItem("noMatrik", noMatrik);

        // Redirect to StudentInfo page (without needing query params)
        router.push("/dashboard");
      } else {
        const errorMessage = await response.json();
        console.error("Error response:", errorMessage);  // Log the error message from backend
        setError(errorMessage.message);
      }
    } catch (err) {
      console.error("Network error:", err);  // Log network errors
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
