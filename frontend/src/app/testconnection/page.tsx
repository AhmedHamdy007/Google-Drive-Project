"use client";
import { useState, useEffect } from 'react';
import '../styles/test.css'; // Import the CSS file

export default function Users() {
  const [users, setUsers] = useState<any[]>([]); // To store the fetched users
  const [message, setMessage] = useState('');

  // Fetch users data when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/get-users'); // Backend URL
        const data = await response.json();

        if (data.success) {
          setUsers(data.data); // Store users in state
        } else {
          setMessage('Failed to fetch users');
        }
      } catch (error: any) {
        setMessage('Error: ' + error.message);
      }
    };

    fetchUsers(); // Call the function to fetch users
  }, []);

  return (
    <div className="container">
      <h2 className="title">Users</h2>
      {message && <p className="error-message">{message}</p>}
      {users.length === 0 ? (
        <p className="no-users">No users found.</p>
      ) : (
        <ul className="user-list">
          {users.map((user: any, index: number) => (
            <li key={index} className="user-item">
              <strong>{user.username}</strong>{' '}
              <span className="user-role">({user.role})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
