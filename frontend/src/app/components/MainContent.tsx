import React from 'react';
import FolderContainer from './folderContainer';
import DailyTasks from './DailyTasks';
import Timetable from './timetable';

// Sample data
const tasks = [
  { name: 'Task1.pdf > App Dev', priority: 'Info' as const },
  { name: 'SEO Analytics', priority: 'Medium' as const },
  { name: 'Logo Design', priority: 'High' as const },
  { name: 'Web Development', priority: 'Low' as const },
];

const folders = [
  { name: 'Projects', color: 'red' as const },
  { name: 'Assignments', color: 'blue' as const },
  { name: 'Exams', color: 'yellow' as const },
  { name: 'Notes', color: 'green' as const },
];

const classes = [
  { day: 'Monday', time: '8:00 AM - 10:00 AM', className: 'App Development' },
  { day: 'Tuesday', time: '10:00 AM - 12:00 PM', className: 'System Design' },
  { day: 'Wednesday', time: '12:00 PM - 2:00 PM', className: 'Internet Programming' },
  { day: 'Thursday', time: '2:00 PM - 4:00 PM', className: 'Web Systems' },
];

// Define days of the week and time slots
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '8:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 2:00 PM',
  '2:00 PM - 4:00 PM',
];

const handleTaskClick = (task: { name: string; priority: 'Info' | 'Medium' | 'High' | 'Low' }) => {
  console.log(`Task clicked: ${task.name}`);
};

const MainContent: React.FC = () => {
  return (
    <div className="main-content">
      <FolderContainer folders={folders} />
      <DailyTasks tasks={tasks} onTaskClick={handleTaskClick} />
      <Timetable classes={classes} daysOfWeek={daysOfWeek} timeSlots={timeSlots} />
    </div>
  );
};

export default MainContent;
 