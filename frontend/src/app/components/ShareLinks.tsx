"use client";
import React, { useState } from "react";
import "../styles/shareLinks.css"; // Link to the styles

const ShareLinks: React.FC = () => {
  const [formData, setFormData] = useState({
    recipientEmails: "", // Changed to handle multiple emails
    subject: "",
    message: "",
    resourceUrl: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate email addresses
  const validateEmails = (emails: string[]) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emails.every((email) => emailRegex.test(email.trim()));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
      const sharedBy = userData?.email;

      if (!sharedBy) {
        setErrorMessage("User email not found. Please log in again.");
        return;
      }

      // Split recipientEmails into an array
      const emailsArray = formData.recipientEmails.split(",").map((email) => email.trim());

      // Validate the emails
      if (!validateEmails(emailsArray)) {
        setErrorMessage("One or more email addresses are invalid.");
        return;
      }

      // Send the POST request to the backend
      const response = await fetch("http://localhost:5000/api/sharedLinks/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shared_by: sharedBy, // Sender's email
          shared_with: emailsArray, // Array of recipient emails
          subject: formData.subject,
          message: formData.message,
          resource_url: formData.resourceUrl,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Resource shared successfully!");
        setFormData({ recipientEmails: "", subject: "", message: "", resourceUrl: "" });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to share the resource.");
      }
    } catch (error) {
      console.error("Error sharing resource:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="share-links-container">
      <h1>Share a Resource</h1>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="share-links-form">
        <div className="form-group">
          <label htmlFor="recipientEmails">Recipient Emails (comma-separated)</label>
          <input
            type="text"
            id="recipientEmails"
            name="recipientEmails"
            value={formData.recipientEmails}
            onChange={handleChange}
            placeholder="Enter recipient emails separated by commas"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter subject"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter your message"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="resourceUrl">Resource URL</label>
          <input
            type="url"
            id="resourceUrl"
            name="resourceUrl"
            value={formData.resourceUrl}
            onChange={handleChange}
            placeholder="Enter resource URL"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Share Resource
        </button>
      </form>
    </div>
  );
};

export default ShareLinks;
