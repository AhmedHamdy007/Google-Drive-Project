"use client";
import React, { useState } from "react";
import { uploadResource } from "../lib/api/apiResources"; // Import the uploadResource function
import "../styles/lecturerUploadLinks.css"; // Link to the styles

interface LinkData {
  category: string;
  referenceName: string;
  session: string;
  semester: string;
  course: string;
  description: string;
  url: string;
}

const LecturerUploadLinks: React.FC<{ onSectionChange: (section: string) => void }> = ({
  onSectionChange,
}) => {
  const [linkData, setLinkData] = useState<LinkData>({
    category: "",
    referenceName: "",
    session: "2024/2025", // Default session
    semester: "1", // Default semester
    course: "",
    description: "",
    url: "",
  });

  const [message, setMessage] = useState<string | null>(null); // Success/error message
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null); // Message type for styling

  // Handle change for form inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLinkData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await uploadResource(linkData); // Automatically includes `uploaded_by` and `no_matrik`
      console.log("Upload Response:", response);
  
      setMessage(response.message || "Resource uploaded successfully!");
      setMessageType("success");
  
      onSectionChange("lecturerLinks"); // Redirect to LecturerLinks
    } catch (error) {
      console.error("Error occurred:", (error as Error).message || error);
  
      setMessage((error as Error).message || "An error occurred. Please try again.");
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
            
            <option value="Research">Research</option>
            <option value="Internship">Internship</option>
            <option value="PSM 1">PSM 1</option>
            <option value="Timetable">Timetable</option>
            <option value="Training/Workshop">Training/Workshop</option>
            <option value="Meeting">Meeting</option>
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

        {/* Session and Semester */}
        <div className="form-group">
          <label htmlFor="session">Session</label>
          <select
            name="session"
            value={linkData.session}
            onChange={handleChange}
            required
          >
            <option value="2020/2021">2020/2021</option>
            <option value="2021/2022">2021/2022</option>
            <option value="2022/2023">2022/2023</option>
            <option value="2023/2024">2023/2024</option>
            <option value="2024/2025">2024/2025</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="semester">Semester</label>
          <select
            name="semester"
            value={linkData.semester}
            onChange={handleChange}
            required
          >
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
        </div>

        {/* Course Code (as text input) */}
        <div className="form-group">
          <label htmlFor="course">Course Code</label>
          <input
            type="text"
            name="course"
            value={linkData.course}
            onChange={handleChange}
            placeholder="Enter Course Code (e.g., SECJ3203)"
            required
          />
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
          Upload Link
        </button>
      </form>
    </div>
  );
};

export default LecturerUploadLinks;
