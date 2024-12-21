"use client";
import { useState } from "react";
import '../styles/sharedLinks.css';


// Define the shared links interface
interface SharedLink {
  title: string;
  url: string;
  description: string;
}

// Example data for shared links
const sharedLinks: SharedLink[] = [
  {
    title: "App dev",
    url: "https://www.example.com/course-materials",
    description: "Access all the course materials for your subjects."
  },
  {
    title: "IP",
    url: "https://www.example.com/student-portal",
    description: "Log into the student portal to check grades and attendance."
  },
  {
    title: "SDA",
    url: "https://www.example.com/library",
    description: "Access the university's online library and research papers."
  }
];

const SharedLinks: React.FC = () => {
  return (
    <div className="container">
      <div className="main-content">
        <h1>Shared Links for Students</h1>
        <p>Here are some useful links for your studies:</p>

        {/* Displaying the links */}
        <div className="links-list">
          {sharedLinks.map((link, index) => (
            <div className="link-card" key={index}>
              <h3>{link.title}</h3>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                Visit Link
              </a>
              <p>{link.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SharedLinks;
