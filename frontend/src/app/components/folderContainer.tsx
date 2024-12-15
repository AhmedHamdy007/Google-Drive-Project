import React from 'react';
import Folder from './folder';

interface FolderContainerProps {
  folders: { name: string; color: 'red' | 'blue' | 'yellow' | 'green' }[]; // Explicitly define the type
}

const FolderContainer: React.FC<FolderContainerProps> = ({ folders }) => {
  return (
    <div className="folders">
      {folders.map((folder, index) => (
        <Folder key={index} name={folder.name} color={folder.color} />
      ))}
    </div>
  );
};

export default FolderContainer;
