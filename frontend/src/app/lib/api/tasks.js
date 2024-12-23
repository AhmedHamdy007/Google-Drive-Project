import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/tasks'; // Backend API

// Exported functions for task-related API calls
export const fetchTasks = async (matricNo) => {
  const response = await axios.get(`http://localhost:5000/api/tasks/${matricNo}`);
  return response.data;
};



export const createTask = async (taskData) => {
  const response = await axios.post('http://localhost:5000/api/tasks', taskData);
  return response.data;
};

export const updateTask = async (taskId, updatedData) => {
  const response = await axios.put(`${API_BASE_URL}/${taskId}`, updatedData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await axios.delete(`${API_BASE_URL}/${taskId}`);
  return response.data;
};
