"use client";

import React, { useEffect, useState } from "react";
import LinkContainer from "../components/LinkContainer";
import { fetchTasks } from "../lib/api/tasks";
import "../styles/dashboard.css"; // Simplified CSS for dashboard

const timeSlots = [
  "8:00-10:00",
  "10:00-12:00",
  "12:00-2:00",
  "2:00-4:00",
  "4:00-5:00",
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const DashboardPage: React.FC = () => {
  const [sharedLinks, setSharedLinks] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch shared links, tasks, and timetable
  useEffect(() => {
    const fetchSharedLinks = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
        const email = userData?.email;

        if (!email) {
          setError("User email not found. Please log in again.");
          return;
        }

        const response = await fetch(`http://localhost:5000/api/sharedLinks/inbox?email=${email}`);
        const data = await response.json();

        if (response.ok) {
          setSharedLinks(data.slice(0, 4)); // Fetch latest 4 shared links
        } else {
          setError(data.message || "Failed to fetch shared links.");
        }
      } catch (err) {
        console.error("Error fetching shared links:", err);
        setError("An error occurred while fetching shared links.");
      }
    };

    const fetchDailyTasks = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
        const matricNo = userData?.login_name;
        const tasks = await fetchTasks(matricNo);
        setTasks(tasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    const fetchTimetableData = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
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

    fetchSharedLinks();
    fetchDailyTasks();
    fetchTimetableData();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Shared Links */}
      <div className="links-section">
        <h2>Latest Shared Links</h2>
        {sharedLinks.length > 0 ? (
          <ul className="shared-links-list">
            {sharedLinks.map((link) => (
              <li key={link._id} className="shared-link-item">
                <strong>{link.subject}</strong>
                <p>{link.message}</p>
                < a href={link.resource_url} target="_blank" rel="noopener noreferrer">
                  View Link
                </a>
                <p>Shared by: {link.shared_by}</p>
                <p>Date: {new Date(link.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No shared links available!</p>
        )}
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
