import React, { useState, useEffect } from 'react';

interface Task {
  name: string;
  priority: 'High' | 'Medium' | 'Low' | 'Info';
}

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onSave }) => {
  const [taskName, setTaskName] = useState(task.name);
  const [taskPriority, setTaskPriority] = useState(task.priority);

  const handleSave = () => {
    if (taskName.trim()) {
      onSave({ name: taskName, priority: taskPriority });
    }
  };

  // Close the modal when the Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose} // Close when clicking outside
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()} // Prevent overlay click from propagating
      >
        <h3 id="modal-title">Edit Task</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div>
            <label htmlFor="taskName">Task Name:</label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="taskPriority">Priority:</label>
            <select
              id="taskPriority"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value as Task['priority'])}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="Info">Info</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" disabled={!taskName.trim()}>
              Save
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
