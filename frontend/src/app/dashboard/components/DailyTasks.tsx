import React from 'react';

interface Task {
  name: string;
  color: 'red' | 'blue' | 'yellow' | 'green';
}

const tasks: Task[] = [
  { name: 'Task1.pdf > App Dev', color: 'blue' },
  { name: 'SEO Analytics', color: 'yellow' },
  { name: 'Logo Design', color: 'red' },
  { name: 'Web Development', color: 'green' },
];

const DailyTasks: React.FC = () => {
  return (
    <div className="daily-tasks">
      <h3>Daily Tasks</h3>
      {tasks.map((task, index) => (
        <div key={index} className={`task ${task.color}`}>
          {task.name}
        </div>
      ))}
    </div>
  );
};

export default DailyTasks;
