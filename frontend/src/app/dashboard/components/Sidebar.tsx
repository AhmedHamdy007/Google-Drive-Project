import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h2>EduSync</h2>
      <ul>
        <li>Dashboard</li>
        <li>Submissions</li>
        <li>Students</li>
        <li>Files</li>
        <li>Candidate</li>
        <li>Tasks Manager</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
