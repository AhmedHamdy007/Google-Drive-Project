"use client";
import '../styles/login.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  interface UserData {
    full_name: string;
    login_name: string;
    email: string | null;
    description: string;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!login || !password) {
      setError("Please fill in both fields.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
  
      if (response.ok) {
        const result = await response.json();
        const userData = result.data;
        const noMatrik = userData.login_name;
  
        // Save user data to sessionStorage
        sessionStorage.setItem("userData", JSON.stringify(userData));
        sessionStorage.setItem("noMatrik", noMatrik);
  
        // Set active section based on user role
        if (userData.isAdmin) {
          sessionStorage.setItem("activeSection", "adminDashboard");
        } else {
          sessionStorage.setItem("activeSection", "dashboard");
        }
  
        // Trigger real-time layout update
        window.dispatchEvent(new Event("storage"));
  
        // Redirect to the main layout
        router.push("/");
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
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
