import React from 'react';

// Define a type for the days of the week
type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

// Define the type for events
type Events = {
  [key in Day]: string[];
};

const WeeklyTimetable: React.FC = () => {
  const timeSlots = [
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
  ];

  const daysOfWeek: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Mock data for events with proper type
  const events: Events = {
    Monday: ['App Development', '', '', 'System Design', ''],
    Tuesday: ['', 'Internet Programming', 'App Development', '', ''],
    Wednesday: ['', '', 'System Design', 'Internet Programming', ''],
    Thursday: ['', '', '', 'App Development', 'SEO Analytics'],
    Friday: ['Web Development', '', '', 'System Design', ''],
  };

  return (
    <div className="weekly-timetable">
      <h3>Weekly Timetable</h3>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            {daysOfWeek.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((timeSlot, rowIndex) => (
            <tr key={rowIndex}>
              <td>{timeSlot}</td>
              {daysOfWeek.map((day) => (
                <td key={day}>
                  {events[day][rowIndex] ? (
                    <div className="event">{events[day][rowIndex]}</div>
                  ) : (
                    <div className="empty-slot">No Event</div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyTimetable;
