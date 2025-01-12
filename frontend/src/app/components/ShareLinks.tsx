"use client";

import React, { useEffect, useState } from "react";
import "../styles/shareLinks.css";

interface LinkData {
  category: string;
  referenceName: string;
  session: string;
  description: string;
  url: string;
  emails: string;
  sendToEveryone: boolean;
}

interface Category {
  name: string;
  access: string[];
}

const ShareLinks: React.FC<{ onSectionChange: (section: string) => void }> = ({
  onSectionChange,
}) => {
  const [linkData, setLinkData] = useState<LinkData>({
    category: "",
    referenceName: "",
    session: "",
    description: "",
    url: "",
    emails: "",
    sendToEveryone: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );
  const [userRole, setUserRole] = useState<string>("");

  // Fetch categories and sessions from the backend and user role from sessionStorage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
        setUserRole(userData.description); // Set user role

        const response = await fetch(
          "http://localhost:5000/api/categories-sessions"
        );
        const data = await response.json();

        setSessions(data.sessions || []);

        const isAdmin = userData.description === "admin";

        if (isAdmin) {
          setCategories(data.categories || []);
        } else {
          const filteredCategories = (data.categories || []).filter(
            (category: Category) =>
              category.access.includes(userData.description)
          );
          setCategories(filteredCategories);
        }
      } catch (error) {
        console.error("Error fetching categories and sessions:", error);
      }
    };

    fetchData();
  }, []);

  // Handle change for form inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setLinkData((prevData) => ({
        ...prevData,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setLinkData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
    const shared_by = userData.email;

    const requestBody = {
      shared_by,
      shared_with: linkData.sendToEveryone ? "everyone" : linkData.emails,
      category: linkData.category,
      session: linkData.session,
      subject: linkData.referenceName,
      description: linkData.description,
      resource_url: linkData.url,
    };

    try {
      const response = await fetch("http://localhost:5000/api/shared-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 201) {
        const result = await response.json();
        setMessage(result.message || "Resource uploaded successfully!");
        setMessageType("success");
        setLinkData({
          category: "",
          referenceName: "",
          session: "",
          description: "",
          url: "",
          emails: "",
          sendToEveryone: false,
        });
      } else {
        const errorResult = await response.json();
        setMessage(errorResult.message || "Failed to upload resource.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    }

    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 5000);
  };

  return (
    <div className="upload-links-container">
      <h1>Send Links</h1>

      {message && (
        <div className={`message-banner ${messageType}`}>
          <p>{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="upload-links-form">
        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            name="category"
            value={linkData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category: Category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Reference Name */}
        <div className="form-group">
          <label htmlFor="referenceName">Reference Name</label>
          <input
            type="text"
            name="referenceName"
            value={linkData.referenceName}
            onChange={handleChange}
            placeholder="Enter Reference Name"
            required
          />
        </div>

        {/* Recipient Email */}
        <div className="form-group">
          <label htmlFor="emails">Recipient Email(s)</label>
          <input
            type="text"
            name="emails"
            value={linkData.emails}
            onChange={handleChange}
            placeholder="Enter recipient email(s), separated by commas"
            required={!linkData.sendToEveryone}
            disabled={linkData.sendToEveryone}
          />
        </div>

        {/* Session */}
        <div className="form-group">
          <label htmlFor="session">Session</label>
          <select
            name="session"
            value={linkData.session}
            onChange={handleChange}
            required
          >
            <option value="">Select Session</option>
            {sessions.map((session: string) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            value={linkData.description}
            onChange={handleChange}
            placeholder="Enter a short description"
            required
          />
        </div>

        {/* URL Link */}
        <div className="form-group">
          <label htmlFor="url">URL Link</label>
          <input
            type="url"
            name="url"
            value={linkData.url}
            onChange={handleChange}
            placeholder="Enter the URL"
            required
          />
        </div>

        {/* Send to Everyone (Only for Admin and Pensyarah) */}
        {userRole === "admin" || userRole === "Pensyarah" ? (
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="sendToEveryone"
                checked={linkData.sendToEveryone}
                onChange={handleChange}
              />
              Send to Everyone
            </label>
          </div>
        ) : null}

        <button type="submit" className="submit-btn">
          Send Link
        </button>
      </form>
    </div>
  );
};

export default ShareLinks;
