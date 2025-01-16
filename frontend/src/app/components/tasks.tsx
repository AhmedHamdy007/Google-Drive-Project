"use client";
import '../styles/tasks.css';

import { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../lib/api/tasks';

// Define the task interface
interface Task {
  _id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  date: string;
}

// Define the default task form state
const defaultTask: Omit<Task, '_id' | 'status'> = {
  title: '',
  description: '',
  priority: 'medium',
  date: '',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]); // Tasks list
  const [newTask, setNewTask] = useState<Omit<Task, '_id' | 'status'>>({ ...defaultTask }); // New task state
  const [editingTask, setEditingTask] = useState<Task | null>(null); // Editing task state

  useEffect(() => {
    // Retrieve matric number from session storage
    const userData = JSON.parse(sessionStorage.getItem('userData')!);
    const matricNo = userData?.matric_number;

    const getTasks = async () => {
      try {
        const data = await fetchTasks(matricNo); // Fetch tasks for the logged-in user
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      }
    };

    if (matricNo) getTasks();
  }, []);

  const handleCreateTask = async () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem('userData')!);
      const matricNo = userData?.login_name;

      const task = await createTask({ ...newTask, matricNo });
      setTasks([...tasks, task]);
      setNewTask({ ...defaultTask });
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;
    try {
      const updatedTask = await updateTask(editingTask._id, editingTask);
      setTasks(tasks.map(task => (task._id === updatedTask._id ? updatedTask : task)));
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  return (
    <div className="task-page">
      <h1 className="task-page-title">Task Manager</h1>

      {/* Task Form */}
      <div className="task-form">
        <h2 className="task-form-title">{editingTask ? 'Edit Task' : 'New Task'}</h2>
        <input
          type="text"
          placeholder="Title"
          className="task-form-input"
          value={editingTask ? editingTask.title : newTask.title}
          onChange={(e) =>
            editingTask
              ? setEditingTask({ ...editingTask, title: e.target.value })
              : setNewTask({ ...newTask, title: e.target.value })
          }
        />
        <textarea
          placeholder="Description"
          className="task-form-textarea"
          value={editingTask ? editingTask.description : newTask.description}
          onChange={(e) =>
            editingTask
              ? setEditingTask({ ...editingTask, description: e.target.value })
              : setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <select
          className="task-form-select"
          value={editingTask ? editingTask.priority : newTask.priority}
          onChange={(e) =>
            editingTask
              ? setEditingTask({ ...editingTask, priority: e.target.value as Task['priority'] })
              : setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          className="task-form-date"
          value={editingTask ? editingTask.date : newTask.date}
          onChange={(e) =>
            editingTask
              ? setEditingTask({ ...editingTask, date: e.target.value })
              : setNewTask({ ...newTask, date: e.target.value })
          }
        />
        <button
          className="task-form-button"
          onClick={editingTask ? handleUpdateTask : handleCreateTask}
        >
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
      </div>

      {/* Tasks List */}
      <div className="task-list">
        <h2 className="task-list-title">Your Tasks</h2>
        {tasks.map(task => (
          <div key={task._id} className="task-card">
            <h3 className="task-card-title">{task.title}</h3>
            <p className="task-card-description">{task.description}</p>
            <p className="task-card-priority">Priority: {task.priority}</p>
            <p className="task-card-status">Status: {task.status}</p>
            <p className="task-card-date">Date: {new Date(task.date).toLocaleDateString()}</p>
            <button
              className="task-card-button task-card-edit"
              onClick={() => setEditingTask(task)}
            >
              Edit
            </button>
            <button
              className="task-card-button task-card-delete"
              onClick={() => handleDeleteTask(task._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
