"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/myLinks.css";

interface LinkData {
  _id: string;
  shared_with: string;
  category: string;
  session: string;
  subject: string;
  description: string;
  resource_url: string;
}

const MyLinks: React.FC = () => {
  const [sharedLinks, setSharedLinks] = useState<LinkData[]>([]);
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<LinkData | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);

  // Fetch shared links and categories/sessions from the backend
  useEffect(() => {
    const fetchSharedLinks = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
        const email = userData?.email;
        const userRole = userData?.description;

        if (!email || !userRole) {
          setError("User email or role not found. Please log in again.");
          setLoading(false);
          return;
        }

        // Fetch shared links
        const sharedLinksResponse = await axios.get("http://localhost:5000/api/shared-links/shared-by-user", {
          params: { email },
        });
        setSharedLinks(sharedLinksResponse.data);

        // Fetch categories and sessions
        const categorySessionResponse = await axios.get("http://localhost:5000/api/categories-sessions");
        const allCategories = categorySessionResponse.data.categories || [];
        const accessibleCategories = allCategories.filter((cat: any) =>
          cat.access.includes(userRole)
        );
        setCategories(accessibleCategories.map((cat: any) => cat.name));
        setSessions(categorySessionResponse.data.sessions || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchSharedLinks();
  }, []);

  // Toggle expanded link details
  const toggleExpand = (id: string) => {
    setExpandedLinkId((prevId) => (prevId === id ? null : id));
  };

  // Handle delete link
  const handleDeleteLink = async (_id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/shared-links/${_id}`);
      setSharedLinks((prevLinks) => prevLinks.filter((link) => link._id !== _id));
    } catch (error) {
      console.error("Error deleting link:", error);
      setError("Failed to delete link.");
    }
  };

  // Handle edit link
  const handleEditLink = (link: LinkData) => {
    setEditingLink(link);
    setExpandedLinkId(link._id);
  };

  // Handle save updated link
  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingLink) return;

    try {
      await axios.put(`http://localhost:5000/api/shared-links/${editingLink._id}`, editingLink);
      setSharedLinks((prevLinks) =>
        prevLinks.map((link) => (link._id === editingLink._id ? editingLink : link))
      );
      setEditingLink(null);
    } catch (error) {
      console.error("Error updating link:", error);
      setError("Failed to update link.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingLink((prevLink) => (prevLink ? { ...prevLink, [name]: value } : null));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="my-links-container">
      <h1>Your Shared Links</h1>
      <ul className="links-list">
        {sharedLinks.map((link) => (
          <li key={link._id} className="link-item">
            <div className="link-header" onClick={() => toggleExpand(link._id)}>
              <p>
                <strong>{link.subject}</strong> - Shared with: {link.shared_with}
              </p>
              <button className="toggle-btn">{expandedLinkId === link._id ? "Hide Details" : "Show Details"}</button>
            </div>

            {expandedLinkId === link._id && (
              <div className="link-details">
                {editingLink && editingLink._id === link._id ? (
                  <form onSubmit={handleSaveLink} className="edit-form">
                    <div>
                      <label>Recipient Email:</label>
                      <input
                        type="email"
                        name="shared_with"
                        value={editingLink.shared_with}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label>Category:</label>
                      <select name="category" value={editingLink.category} onChange={handleChange} required>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Session:</label>
                      <select name="session" value={editingLink.session} onChange={handleChange} required>
                        {sessions.map((session) => (
                          <option key={session} value={session}>
                            {session}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Subject:</label>
                      <input
                        type="text"
                        name="subject"
                        value={editingLink.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label>Description:</label>
                      <textarea
                        name="description"
                        value={editingLink.description}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label>Resource URL:</label>
                      <input
                        type="url"
                        name="resource_url"
                        value={editingLink.resource_url}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <button type="submit" className="save-btn">Save</button>
                    <button type="button" onClick={() => setEditingLink(null)} className="cancel-btn">Cancel</button>
                  </form>
                ) : (
                  <>
                    <p><strong>Category:</strong> {link.category}</p>
                    <p><strong>Session:</strong> {link.session}</p>
                    <p><strong>Description:</strong> {link.description}</p>
                    <a href={link.resource_url} target="_blank" rel="noopener noreferrer">View Resource</a>
                    <div className="actions">
                      <button onClick={() => handleEditLink(link)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDeleteLink(link._id)} className="delete-btn">Delete</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyLinks;
