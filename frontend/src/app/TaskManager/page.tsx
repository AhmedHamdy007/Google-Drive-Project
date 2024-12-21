"use client";
import "../styles/TaskManager.css";
import React, { useState } from "react";
import NewTask from "../components/NewTask";
import DailyTasks from "../components/DailyTasks";
import TaskModal from "../components/TaskModal";

interface Task {
  name: string;
  priority: "High" | "Medium" | "Low";
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { name: "SEO Analytics", priority: "Medium" },
    { name: "Logo Design", priority: "High" },
    { name: "Web Development", priority: "Low" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Task>({ name: "", priority: "Low" });

  const handleAddTask = () => {
    if (newTask.name.trim()) {
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setNewTask({ name: "", priority: "High" });
      setIsModalOpen(false);
    }
  };

  return (
    <div className="container">
      <div className="main-content">
        <h1>Task Manager</h1>

        {/* Daily Tasks Section */}
        <div className="daily-tasks">
          <DailyTasks tasks={tasks} onTaskClick={() => {}} />
        </div>

        {/* Add Task Button */}
        <button className="add-task-btn" onClick={() => setIsModalOpen(true)}>
          + Add New Task
        </button>

        {/* Modal for Adding a New Task */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add New Task</h3>
              <label>
                Task Name:
                <input
                  type="text"
                  value={newTask.name}
                  onChange={(e) =>
                    setNewTask({ ...newTask, name: e.target.value })
                  }
                  placeholder="Enter task name"
                />
              </label>
              <label>
                Priority:
                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      priority: e.target.value as Task["priority"],
                    })
                  }
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </label>
              <button onClick={handleAddTask}>Add Task</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
