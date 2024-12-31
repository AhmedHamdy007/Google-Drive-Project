import React, { useEffect, useState } from "react";
import "../styles/sidebar.css";

const Sidebar: React.FC<{ onSectionChange: (section: string) => void }> = ({ onSectionChange }) => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userData = sessionStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setRole(parsedUserData.description);
    }
  }, []);

  return (
    <nav className="sidebar">
      <h2>EduSync</h2>
      <ul>
        <li>
          <button onClick={() => onSectionChange("dashboard")}>Dashboard</button>
        </li>
        <li>
          <button onClick={() => onSectionChange("sharedLinks")}>Shared Links</button>
        </li>
        {role === "Pensyarah" && (
          <li>
            <button onClick={() => onSectionChange("LecturerUploadLinks")}>
              Upload Resources
            </button>
          </li>
        )}
        <li>
          <button onClick={() => onSectionChange("timetable")}>Timetable</button>
        </li>
        <li>
          <button onClick={() => onSectionChange("tasks")}>Tasks Manager</button>
        </li>
        <li>
          <button onClick={() => onSectionChange("studentInfo")}>Student Info</button>
        </li>
        <li>
          <button onClick={() => onSectionChange("settings")}>Settings</button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
