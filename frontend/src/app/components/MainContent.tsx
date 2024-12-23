"use client";
import React, { useEffect, useState } from 'react';
import LinkContainer from './LinkContainer';
import { fetchTasks } from '../lib/api/tasks'; // Import your fetchTasks API function

interface Resource {
  _id: string;
  title: string;
  url: string;
  category: string;
  referenceName: string;
  uploadedBy: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  date: string;
}

const MainContent: React.FC = () => {
  const [links, setLinks] = useState<Resource[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch links
  const fetchLinks = async () => {
    try {
      const response = await fetch('http://localhost:5000/resources');
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
        console.error('Failed to fetch resources.');
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  // Fetch daily tasks
  const fetchDailyTasks = async () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem('userData')!);
      const matricNo = userData?.login_name;
  
      // Fetch all tasks for the user
      const tasks = await fetchTasks(matricNo);
  
      // Set tasks without filtering by date
      setTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  

  useEffect(() => {
    fetchLinks();
    fetchDailyTasks();
  }, []);

  const colorPalette = ['red', 'blue', 'yellow', 'green'] as const;

  return (
    <div className="main-content-container">
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
    tasks.map((task: Task) => (
      <div key={task._id} className={`task-card ${task.priority}`}>
        <h3 className="task-card-title">{task.title}</h3>
        <p className="task-card-priority">Priority: {task.priority}</p>
        <p className="task-card-status">Status: {task.status}</p>
        <p className="task-card-date">Date: {new Date(task.date).toLocaleDateString()}</p>
      </div>
    ))
  ) : (
    <p className="no-tasks">No tasks available!</p>
  )}
</div>


    </div>
  );
};

export default MainContent;
