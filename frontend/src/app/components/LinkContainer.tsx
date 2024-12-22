import React from 'react';
import Link from './Link';
import "../styles/link.css";

interface LinkContainerProps {
  links: {
    name: string;
    url: string;
    color: 'red' | 'blue' | 'yellow' | 'green';
    category: string;
    referenceName: string;
    uploadedBy: string;
  }[];
}

const LinkContainer: React.FC<LinkContainerProps> = ({ links }) => {
  return (
    <div className="link-container">
      {links.map((link, index) => (
        <Link
          key={index}
          name={link.name}
          url={link.url}
          color={link.color}
          category={link.category}
          referenceName={link.referenceName}
          uploadedBy={link.uploadedBy}
        />
      ))}
    </div>
  );
};

export default LinkContainer;
