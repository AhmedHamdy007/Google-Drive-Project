import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/sidebar.css';

const Sidebar: React.FC<{ onSectionChange: (section: string) => void }> = ({ onSectionChange }) => {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setRole(parsedUserData.description);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear(); // Clear all session storage
    router.push('/login'); // Redirect to login
  };

  return (
    <nav className="sidebar">
      <h2>EduSync</h2>
      <ul>
        <li>
          <button onClick={() => onSectionChange('dashboard')}>Dashboard</button>
        </li>
        <li>
          <button onClick={() => onSectionChange('Inbox')}>Inbox</button>
        </li>

        <li>
          <button onClick={() => onSectionChange('sharedLinks')}>Shared Links</button>
        </li>
        {role === 'Pensyarah' && (
          <li>
            <button onClick={() => onSectionChange('LecturerUploadLinks')}>Upload Resources</button>
          </li>
        )}
          {role == 'Pensyarah' &&(
          <li>
          <button onClick={() => onSectionChange("lecturerLinks")}>My Links</button>
        </li>
        )}
        <li>
          <button onClick={() => onSectionChange('ShareLinks')}>Share Links</button>
        </li>
         <li>
          <button onClick={() => onSectionChange('timetable')}>Timetable</button>
        </li>
        <li>
          <button onClick={() => onSectionChange('tasks')}>Tasks Manager</button>
        </li>
        <li>
          <button onClick={() => onSectionChange('studentInfo')}>User's Info</button>
        </li>
        
      </ul>
      <hr />
      <button className="logout-button" onClick={handleLogout}>Log Out</button>
    </nav>
  );
};

export default Sidebar;
