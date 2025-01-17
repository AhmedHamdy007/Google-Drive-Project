"use client";
import '../styles/studentinfo.css';
import { useEffect, useState } from "react";

// Define types for user and subject data
interface UserData {
  session_id: string;
  matric_number: string; // Matric number
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

export default function StudentInfo() {
  const [userData, setUserData] = useState<UserData | null>(null); // User data
  const [subjects, setSubjects] = useState<Subject[]>([]); // Subjects data
  const [error, setError] = useState(""); // Error handling
  const [session, setSession] = useState("2024/2025"); // Default to "2024/2025"
  const [semester, setSemester] = useState("1"); // Default to "1"

  useEffect(() => {
    // Retrieve user data and matric number from sessionStorage
    const storedUserData = sessionStorage.getItem("userData");
    const storedNoMatrik = sessionStorage.getItem("noMatrik");

    if (storedUserData && storedNoMatrik) {
      setUserData(JSON.parse(storedUserData)); // Set user data from sessionStorage
      fetchSubjects(storedNoMatrik, session, semester); // Fetch subjects based on matric number, session, and semester
    } else {
      setError("No user data found. Please log in again.");
    }
  }, [session, semester]); // Trigger re-fetch when session or semester changes

  // Fetch subjects data based on matric number, session, and semester
  const fetchSubjects = async (noMatrik: string, sesi: string, semester: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/user-subjects?no_matrik=${encodeURIComponent(
          noMatrik
        )}&sesi=${encodeURIComponent(sesi)}&semester=${encodeURIComponent(semester)}`
      );

      if (response.ok) {
        const result = await response.json();
        setSubjects(result);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.message);
      }
    } catch (err) {
      setError("An error occurred while fetching subjects.");
    }
  };

  const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSession(e.target.value);
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSemester(e.target.value);
  };

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="student-info-container">
      <h1 className="page-title">User Info Dashboard</h1>

      {/* User Information */}
      {userData ? (
        <section className="user-info">
          <h2 className="section-title">User Information</h2>
          <p>
            <strong>Full Name:</strong> {userData.full_name            }
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          {/* <p>
            <strong>Session ID:</strong> {userData.session_id}
          </p> */}
          <p>
            <strong>Description:</strong> {userData.description}
          </p>
          <p>
            <strong>Matric No:</strong> {userData.matric_number} {/* Matric number */}
          </p>
        </section>
      ) : (
        <p className="no-data-message">No user data available.</p>
      )}

      {/* Session and Semester Selection */}
      <section className="filters">
        <h2 className="section-title">Filter Subjects</h2>
        <div className="filter-group">
          <label htmlFor="session">Session</label>
          <select name="session" id="session" value={session} onChange={handleSessionChange} required>
            <option value="2020/2021">2020/2021</option>
            <option value="2021/2022">2021/2022</option>
            <option value="2022/2023">2022/2023</option>
            <option value="2023/2024">2023/2024</option>
            <option value="2024/2025">2024/2025</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="semester">Semester</label>
          <select name="semester" id="semester" value={semester} onChange={handleSemesterChange} required>
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
                <tr key={index}>
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
    </div>
  );
}
