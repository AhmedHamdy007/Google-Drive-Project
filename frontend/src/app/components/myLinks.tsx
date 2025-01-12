"use client";
import React, { useEffect, useState } from "react";
import {
  fetchUserResources,
  deleteResource,
  editResource,
} from "../lib/api/apiResources";
import { deleteSharedLink } from "../lib/api/apiResources";
import axios from "axios";
import "../styles/lecturerLinks.css";

// Define the data structure for links
interface LinkData {
  _id: string;
  category?: string;
  referenceName?: string;
  session?: string;
  semester?: string;
  course?: string;
  description?: string;
  url?: string; // Optional, because not all links will have this
  resource_url?: string; // Add this to handle shared links
  shared_with?: string;
  subject?: string;
  message?: string;
}

const LecturerLinks: React.FC = () => {
  const [uploadedLinks, setUploadedLinks] = useState<LinkData[]>([]);
  const [sharedLinks, setSharedLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch links based on user role
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
        const email = userData?.email;
        const noMatrik = userData?.login_name;
        const role = userData?.description; // Role should be "Pensyarah" or "Student"

        if (!email || !noMatrik || !role) {
          setError("Unable to identify the current user. Please log in again.");
          setLoading(false);
          return;
        }

        // Fetch uploaded links only if the user is a Pensyarah
        if (role === "Pensyarah") {
          const uploadedData = await fetchUserResources(noMatrik);
          setUploadedLinks(uploadedData);
        }

        // Fetch shared links for all users
        const sharedResponse = await axios.get(
          "http://localhost:5000/api/sharedLinks/shared-by-user",
          { params: { email } }
        );
        setSharedLinks(sharedResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching links:", err);
        setError("Failed to fetch links. Please try again later.");
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  // Handle delete functions
  const handleDeleteResource = async (_id: string) => {
    try {
      await deleteResource(_id);
      setUploadedLinks((prevLinks) =>
        prevLinks.filter((link) => link._id !== _id)
      );
    } catch (error) {
      console.error("Error deleting resource:", error);
      setError("Failed to delete resource.");
    }
  };

  const handleDeleteSharedLink = async (_id: string) => {
    try {
      await deleteSharedLink(_id);
      setSharedLinks((prevLinks) =>
        prevLinks.filter((link) => link._id !== _id)
      );
    } catch (error) {
      console.error("Error deleting shared link:", error);
      setError("Failed to delete shared link.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="lecturer-links-container">
      {uploadedLinks.length > 0 && (
        <>
          <h1>Your Uploaded Links</h1>
          <ul className="links-list">
            {uploadedLinks.map((link) => (
              <li key={link._id} className="link-item">
                <p>
                  <strong>{link.referenceName}</strong> - {link.category}
                </p>
                <p>{link.description}</p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!link.url) {
                      e.preventDefault();
                      alert("The link is missing or invalid.");
                    }
                  }}
                >
                  View Shared Link
                </a>

                <div className="actions">
                  <button
                    onClick={() => handleDeleteResource(link._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <h1>Your Shared Links</h1>
      <ul className="links-list">
        {sharedLinks.map((link) => (
          <li key={link._id} className="link-item">
            <p>
              <strong>{link.subject}</strong> - {link.shared_with}
            </p>
            <p>{link.message}</p>
            <a
              href={link.url || link.resource_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Shared Link
            </a>

            <div className="actions">
              <button
                onClick={() => handleDeleteSharedLink(link._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LecturerLinks;
