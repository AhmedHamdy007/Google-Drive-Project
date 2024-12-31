"use client";

import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <html lang="en">
      <body>
        <div className="layout-container">
          {/* Sidebar with section change handler */}
          <Sidebar onSectionChange={setActiveSection} />

          {/* MainContent to render the active section */}
          <MainContent activeSection={activeSection} />
        </div>
      </body>
    </html>
  );
}
