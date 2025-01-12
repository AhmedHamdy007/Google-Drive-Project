"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamic imports for pages
const Dashboard = dynamic(() => import("../dashboard/page"), { ssr: false });
const MyLinks = dynamic(() => import("./myLinks"), { ssr: false });
const TasksPage = dynamic(() => import("./tasks"), { ssr: false });
const ShareLinks = dynamic(() => import("./ShareLinks"), { ssr: false });
const Inbox = dynamic(() => import("./Inbox"), { ssr: false });
const CategoryManagement = dynamic(() => import("./admin/categoryManagement"), { ssr: false });

const TimetablePage = dynamic(() => import("./timetable"), { ssr: false });
const StudentInfo = dynamic(() => import("./StudentInfo"), { ssr: false });

const UserManagement = dynamic(() => import("./admin/UserManagement"), {
  ssr: false,
});
const CourseManagement = dynamic(() => import("./admin/CourseManagement"), {
  ssr: false,
});
const AdminDashboard = dynamic(() => import("../dashboard-admin/page"), {
  ssr: false,
});

interface MainContentProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      
      case "tasks":
        return <TasksPage />;
      case "timetable":
        return <TimetablePage />;
      case "studentInfo":
        return <StudentInfo />;
      case "userManagement":
        return <UserManagement />;
      case "courseManagement":
        return <CourseManagement />;
      case "adminDashboard":
        return <AdminDashboard />;
        case "myLinks":
        return <MyLinks />;
        case "ShareLinks":
          return <ShareLinks />;
          case "categoryManagement":
          return <CategoryManagement />;
          case "Inbox":
          return <Inbox />;
      default:
        return <Dashboard />;
    }
  };

  return <div className="main-content">{renderContent()}</div>;
};

export default MainContent;
