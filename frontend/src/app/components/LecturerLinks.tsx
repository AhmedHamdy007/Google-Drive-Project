"use client";
import React, { useEffect, useState } from "react";
import { fetchUserResources } from "../lib/api/apiResources"; // Use the specific API function
import "../styles/lecturerLinks.css";

interface LinkData {
  id: string;
  category: string;
  referenceName: string;
  session: string;
  semester: string;
  course: string;
  description: string;
  url: string;
}

const LecturerLinks: React.FC = () => {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserLinks = async () => {
      try {
        // Retrieve user data from sessionStorage
        const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
        const noMatrik = userData?.login_name; // Replace with your field for matric number

        if (!noMatrik) {
          setError("Unable to identify the current user. Please log in again.");
          setLoading(false);
          return;
        }

        // Fetch resources uploaded by the current user
        const data = await fetchUserResources(noMatrik);
        setLinks(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError("Failed to fetch resources. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserLinks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="lecturer-links-container">
      <h1>Your Uploaded Links</h1>
      <ul className="links-list">
        {links.map((link) => (
          <li key={link.id} className="link-item">
            <p>
              <strong>{link.referenceName}</strong> - {link.category}
            </p>
            <p>{link.description}</p>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              View Link
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LecturerLinks;
