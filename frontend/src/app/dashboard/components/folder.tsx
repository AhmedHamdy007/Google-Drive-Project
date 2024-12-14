import React from 'react';

interface FolderProps {
  name: string;
  color: 'red' | 'blue' | 'yellow' | 'green';
}

const Folder: React.FC<FolderProps> = ({ name, color }) => {
  return (
    <div className={`folder ${color}`}>
      <span>{name}</span>
    </div>
  );
};

export default Folder;
