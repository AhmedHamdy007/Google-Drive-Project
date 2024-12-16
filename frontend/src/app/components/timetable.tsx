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
          {timeSlots.map((timeSlot) => (
            <tr key={timeSlot}>
              <td>{timeSlot}</td>
              {daysOfWeek.map((day) => (
                <td key={`${day}-${timeSlot}`}>
                  {classes
                    .filter((entry) => entry.day === day && entry.time === timeSlot)
                    .map((entry, idx) => (
                      <div key={idx} className="event">
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
