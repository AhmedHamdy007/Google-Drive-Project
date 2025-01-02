"use client";
import React, { useEffect, useState } from "react";
import "../styles/inbox.css";

interface LinkData {
  _id: string;
  subject: string;
  message: string;
  resource_url: string;
  shared_by: string;
  createdAt: string;
}

const Inbox: React.FC = () => {
  const [links, setLinks] = useState<LinkData[]>([]); // Define the type for the links
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInboxLinks = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
        const email = userData?.email;

        if (!email) {
          setError("User email not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/sharedLinks/inbox?email=${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLinks(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch inbox links.");
        }
      } catch (error) {
        console.error("Error fetching inbox links:", error);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInboxLinks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="inbox-container">
      <h1>Inbox</h1>
      {links.length === 0 ? (
        <p>No shared links found.</p>
      ) : (
        <ul className="inbox-list">
          {links.map((link) => (
            <li key={link._id} className="inbox-item">
              <h3>{link.subject}</h3>
              <p>{link.message}</p>
              <a href={link.resource_url} target="_blank" rel="noopener noreferrer">
                View Resource
              </a>
              <p>Shared by: {link.shared_by}</p>
              <p>Date: {new Date(link.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inbox;
