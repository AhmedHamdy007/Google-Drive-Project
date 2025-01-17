"use client";

import { useEffect, useState } from "react";
import "../../styles/userManagement.css"; // Import the new CSS file

interface User {
  _id: string;
  full_name: string;
  matric_number: string;
  email: string;
  description: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          setError("Failed to fetch users.");
        }
      } catch (error) {
        setError("An error occurred while fetching users.");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-management-container">
      <h1>User Management</h1>
      {error && <p className="error">{error}</p>}
      {!error && users.length === 0 && <p className="no-users">No users found.</p>}

      {users.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Matric Number</th>
              <th>Email</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.full_name}</td>
                <td>{user.matric_number}</td>
                <td>{user.email || "N/A"}</td>
                <td>{user.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
