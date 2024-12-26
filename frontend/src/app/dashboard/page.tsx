"use client";
import React, { useEffect, useState } from "react";
import LinkContainer from "../components/LinkContainer";
import { fetchTasks } from "../lib/api/tasks"; // Import your fetchTasks API function
import '../styles/dashboard.css'; // Import the CSS file

const timeSlots = [
  "8:00-10:00",
  "10:00-12:00",
  "12:00-2:00",
  "2:00-4:00",
  "4:00-5:00",
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const DashboardPage: React.FC = () => {
  const [links, setLinks] = useState<any[]>([]); // Links state
  const [tasks, setTasks] = useState<any[]>([]); // Tasks state
  const [timetable, setTimetable] = useState<any[]>([]); // Timetable state
  const [loading, setLoading] = useState<boolean>(false); // Loading state for timetable
  const [error, setError] = useState<string>(""); // Error handling state

  // Fetch links
  const fetchLinks = async () => {
    try {
      const response = await fetch("http://localhost:5000/resources");
      if (response.ok) {
        const data = await response.json();
        const transformedData = data.map((item: any) => ({
          _id: item._id,
          title: item.title,
          url: item.url,
          category: item.category,
          referenceName: item.reference_name,
          uploadedBy: item.uploaded_by,
        }));
        setLinks(transformedData.slice(-4).reverse());
      } else {
        console.error("Failed to fetch resources.");
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  // Fetch daily tasks
  const fetchDailyTasks = async () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem("userData")!);
      const matricNo = userData?.login_name;

      // Fetch all tasks for the user
      const tasks = await fetchTasks(matricNo);

      // Set tasks without filtering by date
      setTasks(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch timetable
  const fetchTimetableData = async () => {
    const userData = JSON.parse(sessionStorage.getItem("userData")!);
    const matricNo = userData?.login_name;

    setLoading(true);  // Start loading

    try {
      const response = await fetch(
        `http://localhost:5000/api/timetable/${matricNo}`
      );

      if (response.ok) {
        const data = await response.json();
        setTimetable(data);
      } else {
        const errorMessage = await response.text();
        setError("Failed to fetch timetable.");
      }
    } catch (error) {
      console.error("Error fetching timetable:", error);
      setError("An error occurred while fetching timetable.");
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  useEffect(() => {
    fetchLinks();
    fetchDailyTasks();
    fetchTimetableData();
  }, []);

  const colorPalette = ["red", "blue", "yellow", "green"] as const;

  return (
    <div className="dashboard-container">
      {/* Left Section: Latest Links */}
      <div className="links-section">
        <LinkContainer
          links={links.map((link, index) => ({
            name: link.title,
            url: link.url,
            color: colorPalette[index % colorPalette.length],
            category: link.category,
            referenceName: link.referenceName,
            uploadedBy: link.uploadedBy,
          }))}
        />
      </div>

      {/* Right Section: Daily Tasks */}
      <div className="tasks-section">
        <h2 className="tasks-title">All Tasks</h2>
        {tasks.length > 0 ? (
          tasks.map((task: any) => (
            <div key={task._id} className={`task-card ${task.priority}`}>
              <h3 className="task-card-title">{task.title}</h3>
              <p className="task-card-priority">Priority: {task.priority}</p>
              <p className="task-card-status">Status: {task.status}</p>
              <p className="task-card-date">
                Date: {new Date(task.date).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="no-tasks">No tasks available!</p>
        )}
      </div>

      {/* Timetable Section */}
      <div className="timetable-section">
        <h2 className="timetable-title">Your Timetable</h2>
        {loading ? (
          <p>Loading timetable...</p>  // Show loading message while fetching
        ) : error ? (
          <p className="error">{error}</p>  // Show error message if any
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
                    <td key={`${slot}-${day}`} className="timetable-cell">
                      {timetable
                        .filter(
                          (entry) => entry.time === slot && entry.day === day
                        )
                        .map((entry) => (
                          <div key={entry._id} className="timetable-entry">
                            <strong>{entry.subject}</strong>
                            <br />
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
