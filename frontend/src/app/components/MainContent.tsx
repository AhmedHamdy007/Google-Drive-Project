"use client";

import dynamic from "next/dynamic";

// Dynamic imports for pages
const Dashboard = dynamic(() => import("../dashboard/page"));
const TasksPage = dynamic(() => import("../tasks/page"));
const TimetablePage = dynamic(() => import("../timetable/page"));
const SharedResources = dynamic(() => import("../sharedLinks/page"));
const StudentInfo = dynamic(() => import("../StudentInfo/page"));
const LecturerUploadLinks = dynamic(() => import("../LecturerUploadLinks/page"));

const MainContent: React.FC<{ activeSection: string }> = ({ activeSection }) => {
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "tasks":
        return <TasksPage />;
      case "timetable":
        return <TimetablePage />;
      case "sharedLinks":
        return <SharedResources />;
      case "studentInfo":
        return <StudentInfo />;
      case "LecturerUploadLinks":
        return <LecturerUploadLinks />;
      default:
        return <Dashboard />;
    }
  };

  return <div className="main-content">{renderContent()}</div>;
};

export default MainContent;
