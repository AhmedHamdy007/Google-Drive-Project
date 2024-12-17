import React from 'react';

interface FolderProps {
  name: string;
  color: 'red' | 'blue' | 'yellow' | 'green';
  onClick?: () => void; // Optional onClick for future interactivity
}

const Folder: React.FC<FolderProps> = ({ name, color, onClick }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      onClick();
    }
  };

  return (
    <div
      role={onClick ? 'button' : undefined} // Only add role when onClick is provided
      tabIndex={onClick ? 0 : undefined} // Allow focus if interactive
      className={`folder ${color}`}
      onClick={onClick}
      onKeyDown={handleKeyDown} // Keyboard support
    >
      <span>{name}</span>
    </div>
  );
};

export default Folder;
