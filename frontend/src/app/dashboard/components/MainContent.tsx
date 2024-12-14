import React from 'react';
import FolderContainer from './folderContainer';
import DailyTasks from './DailyTasks';
import WeeklyTimetable from './timetable';

// Define the folders array with the correct type
const folders: { name: string; color: 'red' | 'blue' | 'yellow' | 'green' }[] = [
  { name: 'App Development', color: 'red' },
  { name: 'System Design', color: 'blue' },
  { name: 'Internet Programming', color: 'yellow' },
  { name: 'Web Development', color: 'green' },
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
        <WeeklyTimetable />
      </div>
    </div>
  );
}
