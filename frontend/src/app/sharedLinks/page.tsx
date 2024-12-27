"use client";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios for API calls
import "../styles/sharedLinks.css"; // Include your CSS file for styling

// Define types for user and resource data
interface UserData {
  session_id: string;
  login_name: string; // Matric number
  full_name: string;
  email: string;
  description: string;
}

interface Subject {
  kod_subjek: string;
  nama_subjek: string;
  seksyen: string;
  semester: number;
  sesi: string;
  tahun_kursus: number;
  status: string;
}

interface Resource {
  _id: string;
  title: string;
  url: string;
  category: string;
  referenceName: string;
  uploadedBy: string;
}

export default function SharedResources() {
  const [userData, setUserData] = useState<UserData | null>(null); // User data
  const [subjects, setSubjects] = useState<Subject[]>([]); // Subjects data
  const [resources, setResources] = useState<Resource[]>([]); // Resources data
  const [error, setError] = useState(""); // Error handling
  const [session, setSession] = useState("2024/2025"); // Default session
  const [semester, setSemester] = useState("1"); // Default semester
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null); // Selected subject
  const [loading, setLoading] = useState<boolean>(false);  // Loading state for resources

  // Fetch user data and enrolled subjects when the component mounts
  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");
    const storedNoMatrik = sessionStorage.getItem("noMatrik");

    if (storedUserData && storedNoMatrik) {
      setUserData(JSON.parse(storedUserData)); // Set user data from sessionStorage
      fetchSubjects(storedNoMatrik, session, semester); // Fetch subjects based on session and semester
    } else {
      setError("No user data found. Please log in again.");
    }
  }, [session, semester]); // Trigger re-fetch when session or semester changes

  // Fetch subjects data based on matric number, session, and semester
  const fetchSubjects = async (noMatrik: string, sesi: string, semester: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/user-subjects?no_matrik=${encodeURIComponent(noMatrik)}&sesi=${encodeURIComponent(sesi)}&semester=${encodeURIComponent(semester)}`
      );

      if (response.ok) {
        const result = await response.json();
        setSubjects(result); // Set subjects for the user
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.message);
      }
    } catch (err) {
      setError("An error occurred while fetching subjects.");
    }
  };

  // Fetch resources for the selected subject
  const handleSubjectClick = async (subjectId: string) => {
    setSelectedSubject(subjectId);
    setLoading(true); // Set loading to true while fetching resources
    setError(""); // Clear previous errors
  
    try {
      const userData = JSON.parse(sessionStorage.getItem("userData")!);
      const matricNo = userData?.login_name;
  
      const requestUrl = `http://localhost:5000/api/resources?no_matrik=${encodeURIComponent(matricNo)}&session=${encodeURIComponent(session)}&semester=${encodeURIComponent(semester)}&courses=${encodeURIComponent(subjectId)}`;
      console.log("Request URL:", requestUrl);  // Log the constructed URL for debugging
  
      // Fetch resources using Axios
      const response = await axios.get(requestUrl);
  
      if (response.data.message) {
        setError(response.data.message); // Show the message if no resources are found
        setResources([]); // Clear any previous resources
      } else {
        setResources(response.data); // Set the fetched resources
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      setError("Failed to fetch resources.");
    } finally {
      setLoading(false); // Stop loading when resources are fetched or error occurs
    }
  };
  
  

  // Handle session change
  const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSession(e.target.value);
  };

  // Handle semester change
  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSemester(e.target.value);
  };

  // If there is an error, show the error message
  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="shared-resources-container">
      <h1 className="page-title">Shared Resources</h1>

      {/* Session and Semester Selection */}
      <section className="filters">
        <h2 className="section-title">Filter Subjects</h2>
        <div className="filter-group">
          <label htmlFor="session">Session</label>
          <select
            name="session"
            id="session"
            value={session}
            onChange={handleSessionChange}
            required
          >
            <option value="2020/2021">2020/2021</option>
            <option value="2021/2022">2021/2022</option>
            <option value="2022/2023">2022/2023</option>
            <option value="2023/2024">2023/2024</option>
            <option value="2024/2025">2024/2025</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="semester">Semester</label>
          <select
            name="semester"
            id="semester"
            value={semester}
            onChange={handleSemesterChange}
            required
          >
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
        </div>
      </section>

      {/* Subjects Information */}
      <section className="subjects-info">
        <h2 className="section-title">Enrolled Subjects</h2>
        {subjects.length > 0 ? (
          <table className="subjects-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Section</th>
                <th>Year</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr
                  key={index}
                  onClick={() => handleSubjectClick(subject.kod_subjek)}
                >
                  <td>{subject.kod_subjek}</td>
                  <td>{subject.nama_subjek}</td>
                  <td>{subject.seksyen}</td>
                  <td>{subject.tahun_kursus}</td>
                  <td>{subject.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data-message">
            No subjects found for sesi: {session} and semester: {semester}.
          </p>
        )}
      </section>

      {/* Resources for the selected subject */}
      {selectedSubject && (
        <section className="resources-info">
          <h2 className="section-title">Resources for {selectedSubject}</h2>
          {loading ? (
            <p>Loading resources...</p>
          ) : resources.length > 0 ? (
            <ul>
              {resources.map((resource, index) => (
                <li key={index}>
                  <strong>{resource.title}</strong>
                  <p>{resource.category}</p>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    View Resource
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No resources found for this subject.</p>
          )}
        </section>
      )}
    </div>
  );
}
