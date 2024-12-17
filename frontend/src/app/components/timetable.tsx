import React from 'react';

type TimetableProps = {
  classes: { day: string; time: string; className: string }[];
  daysOfWeek: string[];
  timeSlots: string[];
};

const Timetable: React.FC<TimetableProps> = ({ classes, daysOfWeek, timeSlots }) => {
  return (
    <div className="weekly-timetable">
      <h3>Weekly Timetable</h3>
      <table aria-label="Weekly Timetable">
        <thead>
          <tr>
            <th scope="col">Time</th>
            {daysOfWeek.map((day) => (
              <th key={day} scope="col">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((timeSlot) => (
            <tr key={timeSlot}>
              <td>{timeSlot}</td>
              {daysOfWeek.map((day) => (
                <td key={`${day}-${timeSlot}`}>
                  {classes
                    .filter((entry) => entry.day === day && entry.time === timeSlot)
                    .map((entry) => (
                      <div key={`${entry.day}-${entry.time}-${entry.className}`} className="event">
                        {entry.className}
                      </div>
                    ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
