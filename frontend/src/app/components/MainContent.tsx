import React from 'react';
import FolderContainer from './folderContainer';
import DailyTasks from './DailyTasks';
import Timetable from './timetable';

// Define the folders array with the correct type
const folders: { name: string; color: 'red' | 'blue' | 'yellow' | 'green' }[] = [
  { name: 'App Development', color: 'red' },
  { name: 'System Design', color: 'blue' },
  { name: 'Internet Programming', color: 'yellow' },
  { name: 'Web Development', color: 'green' },
];

const classes = [
  { day: 'Monday', time: '8:00 AM - 10:00 AM', className: 'App Development' },
  { day: 'Tuesday', time: '10:00 AM - 12:00 PM', className: 'System Design' },
  { day: 'Wednesday', time: '12:00 PM - 2:00 PM', className: 'Internet Programming' },
  { day: 'Thursday', time: '2:00 PM - 4:00 PM', className: 'Web Development' },
  { day: 'Friday', time: '4:00 PM - 5:00 PM', className: 'System Design' },
];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '8:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 2:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
];

export default function MainContent() {
  return (
    <div className="main-content">
      <div className="pinned-folders">
        <h3>Pinned Folders</h3>
        <FolderContainer folders={folders} />
      </div>

      <div className="daily-tasks">
        <DailyTasks />
      </div>

      <div className="weekly-timetable">
      <Timetable classes={classes} daysOfWeek={daysOfWeek} timeSlots={timeSlots} />
      </div>
    </div>
  );
}
