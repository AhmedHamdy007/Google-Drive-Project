"use client";
import '../styles/studentinfo.css';
import { useEffect, useState } from "react";


// Define types for user and subject data
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

export default function StudentInfo() {
  const [userData, setUserData] = useState<UserData | null>(null); // User data
  const [subjects, setSubjects] = useState<Subject[]>([]); // Subjects data
  const [error, setError] = useState(""); // Error handling

  useEffect(() => {
    // Retrieve user data and matric number from sessionStorage
    const storedUserData = sessionStorage.getItem("userData");
    const storedNoMatrik = sessionStorage.getItem("noMatrik");

    if (storedUserData && storedNoMatrik) {
      setUserData(JSON.parse(storedUserData)); // Set user data from sessionStorage
      fetchSubjects(storedNoMatrik); // Fetch subjects based on matric number
    } else {
      setError("No user data found. Please log in again.");
    }
  }, []);

  // Fetch subjects data based on matric number
  const fetchSubjects = async (noMatrik: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/user-subjects?no_matrik=${encodeURIComponent(
          noMatrik
        )}&sesi=2024/2025&semester=1`
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

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div>
      <h1>Student Info Dashboard</h1>

      {/* User Information */}
      {userData ? (
        <div>
          <h2>User Information</h2>
          <p>
            <strong>Full Name:</strong> {userData.full_name}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Session ID:</strong> {userData.session_id}
          </p>
          <p>
            <strong>Description:</strong> {userData.description}
          </p>
          <p>
            <strong>Matric No:</strong> {userData.login_name} {/* Matric number */}
          </p>
        </div>
      ) : (
        <p>No user data available.</p>
      )}

      {/* Subjects Information */}
      <h2>Enrolled Subjects</h2>
      {subjects.length > 0 ? (
        <table>
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
        <p>No subjects found for sesi: 2024/2025 and semester: 1.</p>
      )}
    </div>
  );
}
