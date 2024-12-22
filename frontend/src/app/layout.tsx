"use client"; // Add this at the top to mark the component as client-side

import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "./components/Sidebar"; // Assuming Sidebar is a global component
import { usePathname } from "next/navigation"; // Correct hook to get current path in App Router

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Get the current path

  // Check if the current route is the login page, or any page where you don't want the sidebar
  const isLoginPage = pathname === "/login"; // Adjust this based on your login page route

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="layout-container">
          {/* Sidebar container */}
          {!isLoginPage && (
            <div className="sidebar-container">
              <Sidebar />
            </div>
          )}
          {/* Main content container */}
          <div className="content-container">
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
