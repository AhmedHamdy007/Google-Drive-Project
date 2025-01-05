"use client";
import "../styles/timetable.css";

import { useEffect, useState } from "react";
import {
  fetchTimetable,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
} from "../lib/api/timetable";

interface TimetableEntry {
  _id: string;
  subject: string;
  time: string; // Updated to only use "time"
  day: string;
  location?: string;
}

const timeSlots = [
  "8:00-10:00",
  "10:00-12:00",
  "12:00-2:00",
  "2:00-4:00",
  "4:00-5:00",
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [newEntry, setNewEntry] = useState<Omit<TimetableEntry, "_id">>({
    subject: "",
    time: "",
    day: "",
    location: "",
  });
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);

  useEffect(() => {
    const fetchUserTimetable = async () => {
      const userData = JSON.parse(sessionStorage.getItem("userData")!);
      const matricNo = userData?.login_name;

      try {
        const data = await fetchTimetable(matricNo);
        setTimetable(data);
      } catch (error) {
        console.error("Error fetching timetable:", error);
      }
    };

    fetchUserTimetable();
  }, []);

  const handleCreateEntry = async () => {
    const userData = JSON.parse(sessionStorage.getItem("userData")!);
    const matricNo = userData?.login_name;

    try {
      const entry = await createTimetableEntry({ ...newEntry, matricNo });
      setTimetable([...timetable, entry]);
      setNewEntry({ subject: "", time: "", day: "", location: "" });
    } catch (error) {
      console.error("Failed to create entry:", error);
    }
  };

  const handleUpdateEntry = async () => {
    if (!editingEntry) return;

    try {
      const updatedEntry = await updateTimetableEntry(
        editingEntry._id,
        editingEntry
      );
      setTimetable(
        timetable.map((entry) =>
          entry._id === updatedEntry._id ? updatedEntry : entry
        )
      );
      setEditingEntry(null);
    } catch (error) {
      console.error("Failed to update entry:", error);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteTimetableEntry(id);
      setTimetable(timetable.filter((entry) => entry._id !== id));
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  return (
    <div className="timetable-page">
      <h1 className="timetable-title">Weekly Timetable</h1>

      {/* Timetable Form */}
      <div className="timetable-form">
        <h2>{editingEntry ? "Edit Entry" : "New Entry"}</h2>
        <input
          type="text"
          placeholder="Subject"
          value={editingEntry ? editingEntry.subject : newEntry.subject}
          onChange={(e) =>
            editingEntry
              ? setEditingEntry({ ...editingEntry, subject: e.target.value })
              : setNewEntry({ ...newEntry, subject: e.target.value })
          }
        />
        <select
          value={editingEntry ? editingEntry.time : newEntry.time}
          onChange={(e) =>
            editingEntry
              ? setEditingEntry({ ...editingEntry, time: e.target.value })
              : setNewEntry({ ...newEntry, time: e.target.value })
          }
        >
          <option value="">Select Time Slot</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        <select
          value={editingEntry ? editingEntry.day : newEntry.day}
          onChange={(e) =>
            editingEntry
              ? setEditingEntry({ ...editingEntry, day: e.target.value })
              : setNewEntry({ ...newEntry, day: e.target.value })
          }
        >
          <option value="">Select Day</option>
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Location"
          value={editingEntry ? editingEntry.location : newEntry.location}
          onChange={(e) =>
            editingEntry
              ? setEditingEntry({ ...editingEntry, location: e.target.value })
              : setNewEntry({ ...newEntry, location: e.target.value })
          }
        />
        <button
          className="add-btn"
          onClick={editingEntry ? handleUpdateEntry : handleCreateEntry}
        >
          {editingEntry ? "Update Entry" : "Add Entry"}
        </button>
      </div>

      {/* Timetable Table */}
      <div className="timetable-grid">
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
                          <div className="buttons-container">
                            <button
                              className="edit-btn"
                              onClick={() => setEditingEntry(entry)}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteEntry(entry._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
