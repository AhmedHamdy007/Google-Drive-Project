"use client";
import React, { useState } from 'react';
import Timetable from '../components/timetable'; // Import the Timetable component
import '../styles/timetable.css';

type ClassEntry = {
  day: string;
  time: string;
  className: string;
};

const TimetableManager: React.FC = () => {
  const [classes, setClasses] = useState<ClassEntry[]>([]); // Stores the classes
  const [newClass, setNewClass] = useState<ClassEntry>({
    day: '',
    time: '',
    className: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
  ];

  const handleAddClass = () => {
    if (newClass.day && newClass.time && newClass.className) {
      setClasses([...classes, newClass]);
      setNewClass({ day: '', time: '', className: '' }); // Reset the form
      setIsModalOpen(false); // Close the modal
    }
  };

  return (
    <div className="timetable-manager">
      <div className="manager-content">
        <h2>Timetable Manager</h2>

        {/* Render the Timetable Component with the required props */}
        <Timetable classes={classes} daysOfWeek={daysOfWeek} timeSlots={timeSlots} />

        {/* Add Class Button */}
        <button className="open-modal-btn" onClick={() => setIsModalOpen(true)}>
          Add Class
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add Class</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddClass();
                }}
              >
                <div>
                  <label htmlFor="day">Day:</label>
                  <select
                    id="day"
                    value={newClass.day}
                    onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}
                    required
                  >
                    <option value="">Select a day</option>
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="time">Time Slot:</label>
                  <select
                    id="time"
                    value={newClass.time}
                    onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                    required
                  >
                    <option value="">Select a time slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="className">Class Name:</label>
                  <input
                    type="text"
                    id="className"
                    value={newClass.className}
                    onChange={(e) => setNewClass({ ...newClass, className: e.target.value })}
                    required
                  />
                </div>
                <button type="submit">Add Class</button>
              </form>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableManager;
