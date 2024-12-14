"use client";
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import '../styles/dashboard.css'; // Import the CSS file

const Page: React.FC = () => {
  return (
    <div className="container">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default Page;
