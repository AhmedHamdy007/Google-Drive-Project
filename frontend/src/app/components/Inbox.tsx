"use client";

import React, { useEffect, useState } from "react";
import "../styles/inbox.css";

interface LinkData {
  _id: string;
  subject: string;
  description: string;
  resource_url: string;
  shared_by: string;
  category: string;
  session: string;
  createdAt: string;
}

const Inbox: React.FC = () => {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<LinkData[]>([]);
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date-desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch inbox links from the backend
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

        const response = await fetch(`http://localhost:5000/api/shared-links/inbox?email=${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const sortedData = data.sort((a: LinkData, b: LinkData) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setLinks(sortedData);
          setFilteredLinks(sortedData);
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

  // Search function
  useEffect(() => {
    const filtered = links.filter((link) =>
      link.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.shared_by.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLinks(filtered);
  }, [searchTerm, links]);

  // Sort function
  useEffect(() => {
    let sortedLinks = [...filteredLinks];

    if (sortOption === "date-desc") {
      sortedLinks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === "date-asc") {
      sortedLinks.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortOption === "subject-asc") {
      sortedLinks.sort((a, b) => a.subject.localeCompare(b.subject));
    } else if (sortOption === "subject-desc") {
      sortedLinks.sort((a, b) => b.subject.localeCompare(a.subject));
    }

    setFilteredLinks(sortedLinks);
  }, [sortOption]);

  // Toggle expanded link details
  const toggleExpand = (id: string) => {
    setExpandedLinkId((prevId) => (prevId === id ? null : id));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="inbox-error">{error}</p>;

  return (
    <div className="inbox-container">
      <h1 className="inbox-title">Inbox</h1>

      <div className="inbox-controls">
        <input
          type="text"
          placeholder="Search by subject or shared by..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="inbox-search-bar"
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="inbox-sort-dropdown"
        >
          <option value="date-desc">Date (Newest First)</option>
          <option value="date-asc">Date (Oldest First)</option>
          <option value="subject-asc">Subject (A-Z)</option>
          <option value="subject-desc">Subject (Z-A)</option>
        </select>
      </div>

      {filteredLinks.length === 0 ? (
        <p className="inbox-empty-message">No shared links found.</p>
      ) : (
        <ul className="inbox-list">
          {filteredLinks.map((link) => (
            <li key={link._id} className="inbox-item">
              <div className="inbox-link-header" onClick={() => toggleExpand(link._id)}>
                <p>
                  <strong>{link.subject}</strong> - Shared by: {link.shared_by}
                </p>
                <button className="inbox-toggle-btn">
                  {expandedLinkId === link._id ? "Hide Details" : "Show Details"}
                </button>
              </div>

              {expandedLinkId === link._id && (
                <div className="inbox-link-details">
                  <p><strong>Category:</strong> {link.category}</p>
                  <p><strong>Reference Name:</strong> {link.subject}</p>
                  <p><strong>Session:</strong> {link.session}</p>
                  <p><strong>Description:</strong> {link.description}</p>
                  <p><strong>Resource URL:</strong> {link.resource_url}</p>
                  <a href={link.resource_url} target="_blank" rel="noopener noreferrer">
                    View Resource
                  </a>
                  <p><strong>Shared on:</strong> {new Date(link.createdAt).toLocaleString()}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inbox;
