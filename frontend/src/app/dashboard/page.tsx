"use client";

import { fetchTasks } from "../lib/api/tasks";
import "../styles/dashboard.css";
import React, { useEffect, useState } from "react";

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
        const userData = JSON.parse(sessionStorage.getItem("userData") ?? "{}");
        const email = userData?.email;

        if (!email) {
          setError("User email not found. Please log in again.");
          return;
        }

        // Fetch shared links from the backend
        const response = await fetch(
          `http://localhost:5000/api/shared-links/inbox?email=${email}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch shared links.");
          return;
        }

        const data = await response.json();

        // Sort the links by createdAt in descending order and limit to 4 links
        const sortedLinks = data.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setSharedLinks(sortedLinks.slice(0, 4));
      } catch (err) {
        setError("An error occurred while fetching shared links.");
      }
    };

    const fetchDailyTasks = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("userData") ?? "{}");
        const matricNo = userData?.login_name;
        const tasks = await fetchTasks(matricNo);
        setTasks(tasks);
      } catch (err) {
        setError("An error occurred while fetching tasks.");
      }
    };

    const fetchTimetableData = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem("userData") ?? "{}");
        const matricNo = userData?.login_name;
        setLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/timetable/${matricNo}`
        );
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

  const renderTimetableEntries = (slot: string, day: string) => {
    return timetable
      .filter((entry) => entry.time === slot && entry.day === day)
      .map((entry) => (
        <div key={entry._id} className="timetable-entry">
          <strong className="timetable-subject">{entry.subject}</strong>
          <small className="timetable-location">{entry.location}</small>
        </div>
      ));
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="dashboard-grid">
        {/* Shared Links Section */}
<div className="dashboard-section shared-links-section">
  <h2 className="section-title">Latest Links shared with you</h2>
  {sharedLinks.length > 0 ? (
    <ul className="shared-links-list">
      {sharedLinks.map((link) => (
        <li
          key={link._id}
          className="shared-link-item compact"
          onClick={() => window.open(link.resource_url, "_blank")}
        >
          <strong className="shared-link-subject">{link.subject}</strong>
          <p className="shared-link-meta">
            Shared by: {link.shared_by} | {new Date(link.createdAt).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  ) : (
    <p className="no-data-message">No shared links available!</p>
  )}
</div>

        {/* Tasks Section */}
        <div className="dashboard-section tasks-section">
          <h2 className="section-title">All Tasks</h2>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task._id} className={`task-card ${task.priority}`}>
                <h3 className="task-title">{task.title}</h3>
                <p className="task-status">Status: {task.status}</p>
              </div>
            ))
          ) : (
            <p className="no-data-message">No tasks available!</p>
          )}
        </div>

        {/* Timetable Section */}
        <div className="dashboard-section timetable-section">
          <h2 className="section-title">Your Timetable</h2>
          {loading ? (
            <p className="loading-message">Loading timetable...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <table className="timetable-table">
              <thead>
                <tr>
                  <th className="timetable-header">Time</th>
                  {daysOfWeek.map((day) => (
                    <th key={day} className="timetable-header">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot) => (
                  <tr key={slot} className="timetable-row">
                    <td className="timetable-slot">{slot}</td>
                    {daysOfWeek.map((day) => (
                      <td key={`${slot}-${day}`} className="timetable-cell">
                        {renderTimetableEntries(slot, day)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
