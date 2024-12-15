import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h2>EduSync</h2>
      <ul>
        <li>
          <Link href="/dashboard">Dashboard</Link>
          </li>
        <li>Submissions</li>
        <li>Students</li>
        <li>Files</li>
        <li>Candidate</li>
        <li>
          <Link href="/TaskManager">Tasks Manager</Link>
          </li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
