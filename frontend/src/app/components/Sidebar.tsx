import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '../styles/sidebar.css';

const Sidebar: React.FC = () => {
  const [role, setRole] = useState<string | null>(null); // State to store user role

  useEffect(() => {
    // Fetch user data from sessionStorage
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setRole(parsedUserData.description); // Extract and set role (description)
    }
  }, []);

  return (
    <nav className="sidebar" role="navigation" aria-label="Main Navigation">
      <h2>EduSync</h2>
      <ul>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/sharedLinks" legacyBehavior>
            <a>Shared Links</a>
          </Link>
        </li>
        {/* Conditionally render "Upload Resources" for Pensyarah only */}
        {role === 'Pensyarah' && (
          <li>
            <Link href="/LecturerUploadLinks" legacyBehavior>
              <a>Upload Resources</a>
            </Link>
          </li>
        )}
        <li>
          <Link href="/TimetableManager" legacyBehavior>
            <a>Timetable</a>
          </Link>
        </li>
        <li>
          <Link href="/tasks" legacyBehavior>
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
