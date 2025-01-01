"use client";
import React, { useEffect, useState } from "react";
import {
  fetchUserResources,
  deleteResource,
  editResource,
} from "../lib/api/apiResources";
import "../styles/lecturerLinks.css";

interface LinkData {
  _id: string; // Use MongoDB's unique identifier
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
  const [editMode, setEditMode] = useState<string | null>(null); // To track the link being edited
  const [updatedLink, setUpdatedLink] = useState<LinkData | null>(null); // Temporary storage for editing

  useEffect(() => {
    const fetchUserLinks = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
        const noMatrik = userData?.login_name;

        if (!noMatrik) {
          setError("Unable to identify the current user. Please log in again.");
          setLoading(false);
          return;
        }

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

  const handleDelete = async (_id: string) => {
    try {
      await deleteResource(_id);
      setLinks((prevLinks) => prevLinks.filter((link) => link._id !== _id));
    } catch (error) {
      console.error("Error deleting resource:", error);
      setError("Failed to delete resource.");
    }
  };

  const handleEdit = (link: LinkData) => {
    setEditMode(link._id); // Enable edit mode for the selected link
    setUpdatedLink({ ...link });
  };

  const handleSave = async () => {
    if (!updatedLink) return;

    try {
      await editResource(updatedLink._id, updatedLink);
      setLinks((prevLinks) =>
        prevLinks.map((link) =>
          link._id === updatedLink._id ? { ...updatedLink } : link
        )
      );
      setEditMode(null); // Exit edit mode
      setUpdatedLink(null);
    } catch (error) {
      console.error("Error saving resource:", error);
      setError("Failed to update resource.");
    }
  };

  const handleCancel = () => {
    setEditMode(null); // Exit edit mode without saving
    setUpdatedLink(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!updatedLink) return;
    const { name, value } = e.target;
    setUpdatedLink((prev) => ({ ...prev, [name]: value } as LinkData));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="lecturer-links-container">
      <h1>Your Uploaded Links</h1>
      <ul className="links-list">
        {links.map((link) => (
          <li key={link._id} className="link-item">
            {editMode === link._id ? (
              <div className="edit-form">
                <input
                  type="text"
                  name="referenceName"
                  value={updatedLink?.referenceName || ""}
                  onChange={handleChange}
                  placeholder="Reference Name"
                />
                <textarea
                  name="description"
                  value={updatedLink?.description || ""}
                  onChange={handleChange}
                  placeholder="Description"
                />
                <input
                  type="url"
                  name="url"
                  value={updatedLink?.url || ""}
                  onChange={handleChange}
                  placeholder="URL"
                />
                <div className="edit-form-buttons">
                  <button onClick={handleSave} className="save-btn">
                    Save
                  </button>
                  <button onClick={handleCancel} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="link-details">
                <p>
                  <strong>{link.referenceName}</strong> - {link.category}
                </p>
                <p>{link.description}</p>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  View Link
                </a>
                <div className="actions">
                  <button onClick={() => handleEdit(link)} className="edit-btn">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(link._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LecturerLinks;
