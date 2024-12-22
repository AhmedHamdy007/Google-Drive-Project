"use client";
import React, { useEffect, useState } from 'react';
import LinkContainer from './LinkContainer';

interface Resource {
  _id: string;
  title: string;
  url: string;
  category: string;
  referenceName: string; // Frontend expects this in camelCase
  uploadedBy: string;    // Frontend expects this in camelCase
}

const MainContent: React.FC = () => {
  const [links, setLinks] = useState<Resource[]>([]);

  const fetchLinks = async () => {
    try {
      const response = await fetch('http://localhost:5000/resources');
      if (response.ok) {
        const data = await response.json();

        // Map backend response to match frontend structure
        const transformedData = data.map((item: any) => ({
          _id: item._id,
          title: item.title,
          url: item.url,
          category: item.category,
          referenceName: item.reference_name, // Map underscore to camelCase
          uploadedBy: item.uploaded_by,      // Map underscore to camelCase
        }));

        setLinks(transformedData.slice(-4).reverse());
      } else {
        console.error('Failed to fetch resources.');
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const colorPalette = ['red', 'blue', 'yellow', 'green'] as const; // Explicitly define as a tuple

  return (
    <div className="main-content">
      <LinkContainer
        links={links.map((link, index) => ({
          name: link.title,
          url: link.url,
          color: colorPalette[index % colorPalette.length], // Ensures type safety
          category: link.category,
          referenceName: link.referenceName,
          uploadedBy: link.uploadedBy,
        }))}
      />
    </div>
  );
};

export default MainContent;
