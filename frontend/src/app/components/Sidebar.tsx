import React from 'react';
import Link from 'next/link';
import '../styles/sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h2>EduSync</h2>
      <ul>
        <li>
          <Link href="/dashboard">Dashboard</Link>
          </li>
        <li>Uploaded Files</li>
        <li>Files</li>
        <li>
        <Link href="/TimetableManager">Timetable</Link>
          
        </li>
        <li>
          <Link href="/TaskManager">Tasks Manager</Link>
          </li>
        <li>Student's Info</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
