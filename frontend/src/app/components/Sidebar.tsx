import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../styles/sidebar.css";

const Sidebar: React.FC<{ onSectionChange: (section: string) => void }> = ({
  onSectionChange,
}) => {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = sessionStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setRole(parsedUserData.description);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/login");
  };

  return (
    <nav className="sidebar">
      <h2>EduSync</h2>
      <ul>
        {(role === "Pensyarah" || role === "Pelajar FSKSM") && (
          <>
            <li>
              <button onClick={() => onSectionChange("dashboard")}>
                Dashboard
              </button>
            </li>
            
            <li>
              <button onClick={() => onSectionChange("studentInfo")}>
                User's info
              </button>
            </li>
          </>
        )}

        {role === "admin" && (
          <>
            <li>
              <button onClick={() => onSectionChange("adminDashboard")}>
                Admin Dashboard
              </button>
            </li>

            <li>
              <button onClick={() => onSectionChange("userManagement")}>
                Users info
              </button>
            </li>
            <li>
              <button onClick={() => onSectionChange("categoryManagement")}>
                Category Management
              </button>
            </li>
          </>
        )}
        <li>
              <button onClick={() => onSectionChange("Inbox")}>Links shared to me</button>
            </li>
            <li>
              <button onClick={() => onSectionChange("ShareLinks")}>
                Share Links
              </button>
            </li>
            <li>
              <button onClick={() => onSectionChange("myLinks")}>
                My Links
              </button>
            </li>
           
            <li>
              <button onClick={() => onSectionChange("tasks")}>
                Tasks Manager
              </button>
            </li>
            <li>
              <button onClick={() => onSectionChange("timetable")}>
                Timetable
              </button>
            </li>
      </ul>
      <hr />
      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </nav>
  );
};

export default Sidebar;
