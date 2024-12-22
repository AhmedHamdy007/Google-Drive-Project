"use client";

import MainContent from '../components/MainContent';
import '../styles/dashboard.css'; // Import the CSS file

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-container">
      {/* Main content section */}
      <section className="main-content">
        <MainContent />
      </section>
    </div>
  );
};

export default DashboardPage;
