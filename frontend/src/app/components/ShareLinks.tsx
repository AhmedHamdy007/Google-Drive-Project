"use client";
import React, { useEffect, useState } from "react";
import "../styles/lecturerUploadLinks.css";

interface LinkData {
  category: string;
  referenceName: string;
  session: string;
  description: string;
  url: string;
  email: string;
}

interface Category {
  name: string;
  access: string[];
}

const LecturerUploadLinks: React.FC<{ onSectionChange: (section: string) => void }> = ({
  onSectionChange,
}) => {
  const [linkData, setLinkData] = useState<LinkData>({
    category: "",
    referenceName: "",
    session: "2024/2025",
    description: "",
    url: "",
    email: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  // Fetch categories and sessions from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories-sessions");
        const data = await response.json();

        setSessions(data.sessions || []);

        const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
        const userRole = userData.description;

        const isAdmin = userRole === "admin";

        if (isAdmin) {
          setCategories(data.categories || []);
        } else {
          const filteredCategories = (data.categories || []).filter((category: Category) =>
            category.access.includes(userRole)
          );
          setCategories(filteredCategories);
        }
      } catch (error) {
        console.error("Error fetching categories and sessions:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLinkData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const requestBody = {
      shared_by: "lecturer@example.com", // Replace with actual sender's email
      shared_with: linkData.email,
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
  
      if (response.ok) {
        const result = await response.json();
        setMessage(result.message || "Resource uploaded successfully!");
        setMessageType("success");
  
        onSectionChange("lecturerLinks");
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
  
    // Clear the message after 5 seconds
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
          <select name="category" value={linkData.category} onChange={handleChange} required>
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
          <label htmlFor="email">Recipient Email</label>
          <input
            type="email"
            name="email"
            value={linkData.email}
            onChange={handleChange}
            placeholder="Enter recipient's email"
            required
          />
        </div>

        {/* Session */}
        <div className="form-group">
          <label htmlFor="session">Session</label>
          <select name="session" value={linkData.session} onChange={handleChange} required>
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

        <button type="submit" className="submit-btn">
          Send Link
        </button>
      </form>
    </div>
  );
};

export default LecturerUploadLinks;
