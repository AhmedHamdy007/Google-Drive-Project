import React from 'react';

interface Task {
  name: string;
  priority: 'High' | 'Medium' | 'Low' | 'Info';
}

interface DailyTasksProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const DailyTasks: React.FC<DailyTasksProps> = ({ tasks, onTaskClick }) => {
  const getColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'yellow';
      case 'Low':
        return 'green';
      case 'Info':
      default:
        return 'blue';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, task: Task) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onTaskClick(task);
    }
  };

  return (
    <div className="daily-tasks">
      <h3>Daily Tasks</h3>
      {tasks.map((task, index) => (
        <div
          key={index}
          role="button"
          tabIndex={0} // Ensures focusability
          className={`task ${getColor(task.priority)}`}
          onClick={() => onTaskClick(task)}
          onKeyDown={(e) => handleKeyDown(e, task)} // Handles keyboard interaction
        >
          {task.name}
        </div>
      ))}
    </div>
  );
};

export default DailyTasks;
