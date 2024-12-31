"use client";

import React, { useEffect, useState } from "react";
import LinkContainer from "../components/LinkContainer";
import { fetchTasks } from "../lib/api/tasks";
import '../styles/dashboard.css'; // Simplified CSS for dashboard

const timeSlots = [
  "8:00-10:00",
  "10:00-12:00",
  "12:00-2:00",
  "2:00-4:00",
  "4:00-5:00",
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const DashboardPage: React.FC = () => {
  const [links, setLinks] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch links, tasks, and timetable as before
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch("http://localhost:5000/resources");
        if (response.ok) {
          const data = await response.json();
          setLinks(data.slice(-4).reverse());
        } else {
          console.error("Failed to fetch resources.");
        }
      } catch (err) {
        console.error("Error fetching resources:", err);
      }
    };

    const fetchDailyTasks = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("userData")!);
        const matricNo = userData?.login_name;
        const tasks = await fetchTasks(matricNo);
        setTasks(tasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    const fetchTimetableData = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("userData")!);
        const matricNo = userData?.login_name;
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/timetable/${matricNo}`);
        if (response.ok) {
          const data = await response.json();
          setTimetable(data);
        } else {
          setError("Failed to fetch timetable.");
        }
      } catch (err) {
        setError("An error occurred while fetching timetable.");
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
    fetchDailyTasks();
    fetchTimetableData();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Shared Links */}
      <div className="links-section">
        <h2>Latest Shared Links</h2>
        <LinkContainer links={links} />
      </div>

      {/* Tasks */}
      <div className="tasks-section">
        <h2>All Tasks</h2>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className={`task-card ${task.priority}`}>
              <h3>{task.title}</h3>
              <p>Status: {task.status}</p>
            </div>
          ))
        ) : (
          <p>No tasks available!</p>
        )}
      </div>

      {/* Timetable */}
      <div className="timetable-section">
        <h2>Your Timetable</h2>
        {loading ? (
          <p>Loading timetable...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <table className="timetable-table">
            <thead>
              <tr>
                <th>Time</th>
                {daysOfWeek.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => (
                <tr key={slot}>
                  <td>{slot}</td>
                  {daysOfWeek.map((day) => (
                    <td key={`${slot}-${day}`}>
                      {timetable
                        .filter((entry) => entry.time === slot && entry.day === day)
                        .map((entry) => (
                          <div key={entry._id}>
                            <strong>{entry.subject}</strong>
                            <small>{entry.location}</small>
                          </div>
                        ))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
