import React from 'react';
import "../styles/link.css";

interface LinkProps {
  name: string; // Title of the link
  url: string; // URL of the link
  color: 'red' | 'blue' | 'yellow' | 'green'; // Color for the link card
  category: string; // Category of the resource
  referenceName: string; // Reference name of the resource
  uploadedBy: string; // Name of the person who uploaded the resource
}

const Link: React.FC<LinkProps> = ({ name, url, color, category, referenceName, uploadedBy }) => {
  return (
    <div
      className={`link ${color}`}
      onClick={() => window.open(url, '_blank')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? window.open(url, '_blank') : null)}
    >
      <h3 className="link-title">{name}</h3>
      <p className="link-category"><strong>Category:</strong> {category}</p>
      <p className="link-reference"><strong>Reference:</strong> {referenceName}</p>
      <p className="link-uploader"><strong>Uploaded By:</strong> {uploadedBy}</p>
    </div>
  );
};

export default Link;
