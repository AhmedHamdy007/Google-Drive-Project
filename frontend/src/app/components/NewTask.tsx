import React, { useState } from 'react';

interface Task {
  name: string;
  color: 'red' | 'blue' | 'yellow' | 'green';
}

interface NewTaskProps {
  onTaskAdded: (task: Task) => void;
}

const NewTask: React.FC<NewTaskProps> = ({ onTaskAdded }) => {
  const [taskName, setTaskName] = useState('');
  const [taskColor, setTaskColor] = useState<Task['color']>('blue');

  const handleTaskNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(event.target.value);
  };

  const handleTaskColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTaskColor(event.target.value as Task['color']);
  };

  const handleAddTask = () => {
    if (taskName.trim() !== '') {
      const newTask: Task = {
        name: taskName.trim(),
        color: taskColor,
      };
      onTaskAdded(newTask);
      setTaskName('');
      setTaskColor('blue');
    }
  };

  return (
    <div className="new-task-section">
      <h3>Add New Task</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddTask();
        }}
      >
        <input
          type="text"
          placeholder="Task name"
          value={taskName}
          onChange={handleTaskNameChange}
          required
        />
        <select value={taskColor} onChange={handleTaskColorChange}>
          <option value="blue">Blue</option>
          <option value="yellow">Yellow</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
        </select>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default NewTask;
