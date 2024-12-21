"use client";
import React, { useState } from "react";
import "../styles/lecturerUploadLinks.css"; // Link to the styles

// Define types for the form fields
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLinkData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted link data:", linkData);
    // Add logic here to handle the form submission (e.g., sending data to the server)
  };

  return (
    <div className="upload-links-container">
      <h1>Lecturer: Upload Course Links</h1>
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
            <option value="Course Material">Course Material</option>
            <option value="Assignment">Assignment</option>
            <option value="Lecture Notes">Lecture Notes</option>
            <option value="Exam Papers">Exam Papers</option>
            <option value="Other">Other</option>
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

        <button type="submit" className="submit-btn">Upload Link</button>
      </form>
    </div>
  );
};

export default LecturerUploadLinks;
