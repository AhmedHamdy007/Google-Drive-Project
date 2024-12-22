"use client";
import React, { useState } from "react";
import "../styles/lecturerUploadLinks.css"; // Link to the styles

interface LinkData {
  category: string;
  referenceName: string;
  sessionSemester: string;
  description: string;
  url: string;
}

const LecturerUploadLinks: React.FC = () => {
  const [linkData, setLinkData] = useState<LinkData>({
    category: "",
    referenceName: "",
    sessionSemester: "",
    description: "",
    url: "",
  });

  const [message, setMessage] = useState<string | null>(null); // Success/error message
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null); // Message type for styling

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setLinkData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: linkData.category,
          reference_name: linkData.referenceName,
          session_semester: linkData.sessionSemester,
          description: linkData.description,
          url: linkData.url,
          uploaded_by: "Dr. Lecturer Name", // Replace with dynamic data
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage("Resource uploaded successfully!"); // Success message
        setMessageType("success");
        setLinkData({
          category: "",
          referenceName: "",
          sessionSemester: "",
          description: "",
          url: "",
        }); // Reset the form
      } else {
        const error = await response.json();
        setMessage("Error: " + error.message); // Error message
        setMessageType("error");
      }
    } catch (err) {
      console.error("Error uploading link:", err);
      setMessage("An error occurred. Please try again."); // Error message
      setMessageType("error");
    }

    // Clear the message after a few seconds
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 5000);
  };

  return (
    <div className="upload-links-container">
      <h1>Lecturer: Upload Course Links</h1>

      {/* Display success or error message */}
      {message && (
        <div className={`message-banner ${messageType}`}>
          <p>{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="upload-links-form">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            name="category"
            value={linkData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Course Files">Course Files</option>
            <option value="Course Coordination">Course Coordination</option>
            <option value="Research">Research</option>
            <option value="Internship">Internship</option>
            <option value="PSM 1">PSM 1</option>
            <option value="Timetable">Timetable</option>
            <option value="Training/Workshop">Training/Workshop</option>
            <option value="Meeting">Meeting</option>
          </select>
        </div>

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

        <div className="form-group">
          <label htmlFor="sessionSemester">Session-Semester</label>
          <input
            type="text"
            name="sessionSemester"
            value={linkData.sessionSemester}
            onChange={handleChange}
            placeholder="Enter Session-Semester (e.g., 2024/2025 - Semester 1)"
            required
          />
        </div>

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
          Upload Link
        </button>
      </form>
    </div>
  );
};

export default LecturerUploadLinks;
