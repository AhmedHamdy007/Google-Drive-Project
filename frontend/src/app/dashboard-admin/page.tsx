"use client";

import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <div className="dashboard-admin">
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Admin Dashboard. Here you can manage users, courses, and monitor important tasks.</p>

      <div className="admin-sections">
        <div className="section-card">
          <h2>User Management</h2>
          <p>Manage users, update their information, or remove access if necessary.</p>
          <button onClick={() => window.location.href = "/userManagement"}>Go to User Management</button>
        </div>

        <div className="section-card">
          <h2>Course Management</h2>
          <p>Manage courses, add new ones, or remove outdated courses.</p>
          <button onClick={() => window.location.href = "/courseManagement"}>Go to Course Management</button>
        </div>

        <div className="section-card">
          <h2>Reports</h2>
          <p>View reports and analytics to monitor the system’s performance.</p>
          <button>View Reports</button>
        </div>
      </div>

      <style jsx>{`
        .dashboard-admin {
          padding: 20px;
        }
        .admin-sections {
          display: flex;
          gap: 20px;
        }
        .section-card {
          background-color: #f4f4f4;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          flex: 1;
        }
        .section-card h2 {
          margin-bottom: 10px;
        }
        .section-card button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
        }
        .section-card button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
