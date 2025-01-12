"use client";

import React, { useEffect, useState } from "react";
import "../styles/adminDashboard.css";

interface User {
  name: string;
  email: string;
}

interface Category {
  name: string;
  access: string[];
}

interface Link {
  subject: string;
  message: string;
  resource_url: string;
  shared_by: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  const [latestLinks, setLatestLinks] = useState<Link[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/stats");
        const data = await response.json();

        if (response.ok) {
          setUsers(data.users);
          setCategories(data.categories);
          setSessions(data.sessions);
          setLatestLinks(data.latestLinks);
        } else {
          setError(data.message || "Failed to fetch admin stats.");
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        setError("An error occurred while fetching admin stats.");
      }
    };

    fetchAdminStats();
  }, []);

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="admin-dashboard-container">
      <h1>Admin Dashboard</h1>

      {/* Users Section */}
      <div className="stat-section">
        <h2>Users in the System</h2>
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              {user.name} - <a href={`mailto:${user.email}`}>{user.email}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories Section */}
      <div className="stat-section">
        <h2>Available Categories</h2>
        <ul>
          {categories.map((category, index) => (
            <li key={index}>
              {category.name} (Access: {category.access.join(", ")})
            </li>
          ))}
        </ul>
      </div>

      {/* Sessions Section */}
      <div className="stat-section">
        <h2>Available Sessions</h2>
        <ul>
          {sessions.map((session, index) => (
            <li key={index}>{session}</li>
          ))}
        </ul>
      </div>

      {/* Latest Links Section */}
      <div className="stat-section">
        <h2>Latest Received Links</h2>
        <ul>
          {latestLinks.map((link, index) => (
            <li key={index}>
              <strong>{link.subject}</strong> - Shared by: {link.shared_by}
              <p>Message: {link.message}</p>
              <a
                href={link.resource_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resource
              </a>
              <p>Shared on: {new Date(link.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
