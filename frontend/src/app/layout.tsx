"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Step 1: Check authentication status and active section from sessionStorage
  useEffect(() => {
    const checkAuthStatus = () => {
      const userData = sessionStorage.getItem("userData");
      const storedSection = sessionStorage.getItem("activeSection");

      if (userData) {
        setIsAuthenticated(true);

        // Set active section if available
        if (storedSection) {
          setActiveSection(storedSection);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    // Check auth status on component mount
    checkAuthStatus();

    // ✅ Step 2: Listen for storage changes (real-time updates)
    window.addEventListener("storage", checkAuthStatus);

    // ✅ Step 3: Clean up event listener on component unmount
    return () => {
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, [pathname]);

  // ✅ Render login page if not authenticated
  if (pathname === "/login") {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  // ✅ Render the authenticated layout
  if (isAuthenticated) {
    return (
      <html lang="en">
        <body>
          <div className="layout">
            {/* Sidebar (Fixed on the left) */}
            <Sidebar
              onSectionChange={(section) => {
                setActiveSection(section);
                sessionStorage.setItem("activeSection", section);
              }}
            />

            {/* Main Content (Next to the sidebar) */}
            <div className="main-contentg">
              <MainContent
                activeSection={activeSection}
                onSectionChange={(section) => {
                  setActiveSection(section);
                  sessionStorage.setItem("activeSection", section);
                }}
              />
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Optionally, add a loading screen or fallback
  return null;
}
