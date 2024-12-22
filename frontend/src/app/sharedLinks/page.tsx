"use client";
import { useEffect, useState } from "react";
import '../styles/sharedLinks.css';

// Define the shared links interface
interface SharedLink {
  title: string;
  url: string;
  description: string;
  uploadedBy: string; // Added this field
}

const SharedLinks: React.FC = () => {
  const [links, setLinks] = useState<SharedLink[]>([]); // State for storing links
  const [error, setError] = useState<string | null>(null); // Error message

  // Fetch shared links from the database
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch('http://localhost:5000/resources'); // Replace with actual backend URL
        if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
          const data = await response.json();
          // Map backend fields to frontend fields
          const formattedLinks = data.map((resource: any) => ({
            title: resource.reference_name,
            url: resource.url,
            description: resource.description,
            uploadedBy: resource.uploaded_by, // Map this field
          }));
          setLinks(formattedLinks); // Update state with retrieved links
        } else {
          const text = await response.text();
          console.error("Unexpected response:", text);
          setError("Server returned an unexpected response.");
        }
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('An error occurred while fetching shared links.');
      }
    };

    fetchLinks();
  }, []); // Empty dependency array to run only once

  return (
    <div className="container">
      <div className="main-content">
        <h1>Shared Links for Students</h1>
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <p>Here are some useful links for your studies:</p>
            <div className="links-list">
              {links.map((link, index) => (
                <div className="link-card" key={index}>
                  <h3>{link.title}</h3>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    Visit Link
                  </a>
                  <p>{link.description}</p>
                  <p><strong>Uploaded by:</strong> {link.uploadedBy}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SharedLinks;
