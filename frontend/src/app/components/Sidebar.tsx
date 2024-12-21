import React from 'react';
import Link from 'next/link';
import '../styles/sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <nav className="sidebar" role="navigation" aria-label="Main Navigation">
      <h2>EduSync</h2>
      <ul>
        <li>
        <Link href="/dashboard">Dashboard</Link> 

        </li>
        <li>
          <Link href="/SharedLinks" legacyBehavior>
            <a>Shared Links</a>
          </Link>
        </li>
        <li>
          <Link href="/files" legacyBehavior>
            <a>Files</a>
          </Link>
        </li>
        <li>
          <Link href="/TimetableManager" legacyBehavior>
            <a>Timetable</a>
          </Link>
        </li>
        <li>
          <Link href="/TaskManager" legacyBehavior>
            <a>Tasks Manager</a>
          </Link>
        </li>
        <li>
        <Link href="/StudentInfo">Student Info</Link>
        </li>
        <li>
          <Link href="/settings" legacyBehavior>
            <a>Settings</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
