import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/timetable';

export const fetchTimetable = async (matricNo) => {
  const response = await axios.get(`${API_BASE_URL}/${matricNo}`);
  return response.data;
};

export const createTimetableEntry = async (entryData) => {
  const response = await axios.post(API_BASE_URL, entryData);
  return response.data;
};

export const updateTimetableEntry = async (id, entryData) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, entryData);
  return response.data;
};

export const deleteTimetableEntry = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};
