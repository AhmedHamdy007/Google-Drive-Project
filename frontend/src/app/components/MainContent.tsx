"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamic imports for pages
const Dashboard = dynamic(() => import("../dashboard/page"), { ssr: false });
const TasksPage = dynamic(() => import("../tasks/page"), { ssr: false });
const TimetablePage = dynamic(() => import("../timetable/page"), { ssr: false });
const SharedResources = dynamic(() => import("../sharedLinks/page"), { ssr: false });
const StudentInfo = dynamic(() => import("../StudentInfo/page"), { ssr: false });
const LecturerUploadLinks = dynamic(() => import("../LecturerUploadLinks/page"), { ssr: false });

interface MainContentProps {
  activeSection: string;
}

const MainContent: React.FC<MainContentProps> = ({ activeSection }) => {
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
