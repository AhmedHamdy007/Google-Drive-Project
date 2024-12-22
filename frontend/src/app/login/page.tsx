"use client";
import '../styles/login.css'; // Adjust the path to where your CSS file is located
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // For navigation between pages
import { promises } from 'dns';

export default function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Initialize the router for redirection

  interface UserData {
    full_name: string;
    login_name: string;
    email: string | null; // Can be a string or null
    description: string;
  }
  
  const saveUserToDatabase = async (userData:UserData):Promise<void> => {
    console.log("Data sent to backend:", userData); // Debugging the sent data

    try {
        const response = await fetch('http://localhost:5000/users/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData), // Send the user data directly
        });

        if (response.ok) {
            const result = await response.json();
            console.log("User saved to database:", result); // Debug success
        } else {
            const errorMessage = await response.json();
            console.error("Error saving user to database:", errorMessage); // Debug backend error
        }
    } catch (err) {
        console.error("Network error while saving user:", err); // Debug network error
    }
};

  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Check for empty fields
    if (!login || !password) {
      setError('Please fill in both fields.');
      return;
    }
  
    try {
      // Step 1: Authenticate user
      const response = await fetch('http://localhost:5000/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Login response:", result);
  
        // Step 2: Extract user data and save to sessionStorage
        const userData = result.data;
        const noMatrik = result.data.login_name;
        sessionStorage.setItem("userData", JSON.stringify(userData));
        sessionStorage.setItem("noMatrik", noMatrik);
  
        // Step 3: Save user data to the database
        await saveUserToDatabase(userData);
  
        // Step 4: Redirect to dashboard
        router.push("/dashboard");
      } else {
        const errorMessage = await response.json();
        console.error("Error response:", errorMessage);
        setError(errorMessage.message);
      }
    } catch (err) {
      console.error("Network error:", err);
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
