"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// Define the structure of subjects using TypeScript interfaces
interface Subject {
  kod_subjek: string;
  nama_subjek: string;
  seksyen: string;
  semester: number;
  sesi: string;
  tahun_kursus: number;
  status: string;
}

export default function Test() {
  const [subjects, setSubjects] = useState<Subject[]>([]);  // Store subjects
  const [error, setError] = useState("");  // For error handling
  const searchParams = useSearchParams();
  const noMatrik = searchParams.get("no_matrik");  // Retrieve matric number from the query string

  useEffect(() => {
    if (!noMatrik) {
      setError("Matric number is missing.");
      return;
    }

    const fetchSubjects = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/user-subjects?no_matrik=${encodeURIComponent(
            noMatrik
          )}&sesi=2022/2023&semester=2`
        );

        if (response.ok) {
          const result = await response.json();
          setSubjects(result);  // Set the subjects data
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.message);
        }
      } catch (err) {
        setError("An error occurred while fetching subjects.");
      }
    };

    fetchSubjects();
  }, [noMatrik]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div>
      <h1>Student Dashboard</h1>

      {/* Display Subjects */}
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
        <p>No subjects found for sesi: 2022/2023 and semester: 2.</p>
      )}
    </div>
  );
}
