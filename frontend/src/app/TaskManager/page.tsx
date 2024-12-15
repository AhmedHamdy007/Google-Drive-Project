"use client";
import React, { useState } from 'react';
import NewTask from '../components/NewTask';
import DailyTasks from '../components/DailyTasks';
import Sidebar from '../components/Sidebar';
import '../styles/TaskManager.css'; // Import the CSS file

interface Task {
  name: string;
  color: 'red' | 'blue' | 'yellow' | 'green';
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { name: 'Task1.pdf > App Dev', color: 'blue' },
    { name: 'SEO Analytics', color: 'yellow' },
    { name: 'Logo Design', color: 'red' },
    { name: 'Web Development', color: 'green' },
  ]);

  const handleNewTaskAdded = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <div className="container">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="main-content">
        {/* Daily Tasks Component */}
        <div className="daily-tasks">
          <DailyTasks tasks={tasks} />
        </div>

        {/* New Task Component */}
        <div className="new-task-section">
          <NewTask onTaskAdded={handleNewTaskAdded} />
        </div>
      </div>
    </div>
  );
};

export default TaskManager;