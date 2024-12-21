import React, { useState } from 'react';

interface Task {
  name: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface NewTaskProps {
  onTaskAdded: (task: Task) => void;
}

const NewTask: React.FC<NewTaskProps> = ({ onTaskAdded }) => {
  const [taskName, setTaskName] = useState('');
  const [taskPriority, setTaskPriority] = useState<Task['priority']>('Low');

  const handleTaskNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(event.target.value);
  };

  const handleTaskPriorityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTaskPriority(event.target.value as Task['priority']);
  };

  const handleAddTask = () => {
    const trimmedName = taskName.trim();
    if (trimmedName) {
      const newTask: Task = {
        name: trimmedName,
        priority: taskPriority,
      };
      onTaskAdded(newTask);
      setTaskName('');
      setTaskPriority('Low'); // Reset to default
    }
  };

  return (
    <div className="new-task">
      <h3>Add New Task</h3>
      <input
        type="text"
        placeholder="Task Name"
        value={taskName}
        onChange={handleTaskNameChange}
        aria-label="Task Name"
      />
      <select value={taskPriority} onChange={handleTaskPriorityChange} aria-label="Task Priority">
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button onClick={handleAddTask} disabled={!taskName.trim()}>
        Add Task
      </button>
    </div>
  );
};

export default NewTask;
