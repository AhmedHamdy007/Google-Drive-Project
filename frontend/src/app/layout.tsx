"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import "./globals.css"; // Adjust the path based on your file structure

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  useEffect(() => {
    const userData = sessionStorage.getItem("userData");

    if (!userData && pathname !== "/login") {
      router.push("/login"); // Redirect to login if not authenticated
    } else if (userData) {
      setIsAuthenticated(true); // Set authentication status
    }
  }, [pathname, router]);

  // If on the login page, show only the login content
  if (pathname === "/login") {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  // For authenticated pages, show the full layout
  if (isAuthenticated) {
    return (
      <html lang="en">
        <body>
          <div className="layout">
            {/* Sidebar (Fixed on the left) */}
            <Sidebar onSectionChange={setActiveSection} />

            {/* Main Content (Next to the sidebar) */}
            <div className="main-contentg">
              <MainContent activeSection={activeSection} onSectionChange={setActiveSection} />
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Optionally, add a loading screen or fallback
  return null;
}
