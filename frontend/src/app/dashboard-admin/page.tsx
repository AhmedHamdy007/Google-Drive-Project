import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, LinkIcon, FolderKanban, CalendarDays } from 'lucide-react';
import '../styles/admin.css';

interface User {
  full_name: string;
  email: string;
}

interface Category {
  name: string;
  access: string[];
}

interface Link {
  subject: string;
  message: string;
  resource_url: string;
  shared_by: string;
  createdAt: string;
}

const AdminStatistics = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  const [latestLinks, setLatestLinks] = useState<Link[]>([]);
  const [error, setError] = useState<string | null>(null);

  const activityData = [
    { name: 'Mon', users: 20, links: 15, sessions: 25 },
    { name: 'Tue', users: 25, links: 20, sessions: 30 },
    { name: 'Wed', users: 30, links: 25, sessions: 35 },
    { name: 'Thu', users: 22, links: 18, sessions: 28 },
    { name: 'Fri', users: 28, links: 22, sessions: 32 },
    { name: 'Sat', users: 15, links: 10, sessions: 20 },
    { name: 'Sun', users: 18, links: 12, sessions: 22 },
  ];

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/stats');
        const data = await response.json();

        if (response.ok) {
          setUsers(data.users);
          setCategories(data.categories);
          setSessions(data.sessions);
          setLatestLinks(data.latestLinks);
        } else {
          setError(data.message || 'Failed to fetch admin stats.');
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('An error occurred while fetching admin stats.');
      }
    };

    fetchAdminStats();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  const StatCard = ({ title, value, icon: Icon, description }) => (
    <div className="statCard">
      <div className="statHeader">
        <span className="statTitle">{title}</span>
        <Icon className="h-4 w-4 text-gray-500" />
      </div>
      <div className="statValue">{value}</div>
      <p className="statDescription">{description}</p>
    </div>
  );

  return (
    <div className="dashboardContainer">
      <h1 className="dashboardTitle">Statistics Dashboard</h1>

      <div className="statsGrid">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={Users}
          description="Active users in the system"
        />
        <StatCard
          title="Categories"
          value={categories.length}
          icon={FolderKanban}
          description="Available content categories"
        />
        <StatCard
          title="Active Sessions"
          value={sessions.length}
          icon={CalendarDays}
          description="Currently active sessions"
        />
        <StatCard
          title="Shared Links"
          value={latestLinks.length}
          icon={LinkIcon}
          description="Resources shared this week"
        />
      </div>

      <div className="chartCard">
        <h2 className="chartTitle">Weekly Activity Overview</h2>
        <div className="chartContainer">
          <ResponsiveContainer>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#8884d8" 
                name="Users"
              />
              <Line 
                type="monotone" 
                dataKey="links" 
                stroke="#82ca9d" 
                name="Links"
              />
              <Line 
                type="monotone" 
                dataKey="sessions" 
                stroke="#ffc658" 
                name="Sessions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="activityCard">
        <h2 className="chartTitle">Recent Activity</h2>
        <div>
          {latestLinks.slice(0, 5).map((link, index) => (
            <div key={index} className="activityItem">
              <h3 className="activityTitle">{link.subject}</h3>
              <p className="activityMeta">
                Shared by {link.shared_by} on {new Date(link.createdAt).toLocaleDateString()}
              </p>
              <a
                href={link.resource_url}
                target="_blank"
                rel="noopener noreferrer"
                className="resourceLink"
              >
                View Resource
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;