"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Course = {
  kod_subjek: string;
  nama_subjek: string;
  sesi: string;
  semester: number;
  seksyen: string;
};

export default function TestLecturer() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const noPekerja = searchParams.get("no_pekerja");

  useEffect(() => {
    if (!noPekerja) {
      setError("Lecturer ID is missing.");
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/lecturer-courses?no_pekerja=${encodeURIComponent(
            noPekerja
          )}&sesi=2023/2024&semester=2`
        );

        if (response.ok) {
          const result = await response.json();
          console.log("Fetched courses:", result); // Debug fetched data
          setCourses(result);
        } else {
          const errorMessage = await response.json();
          console.error("Error fetching courses:", errorMessage.message);
          setError(errorMessage.message);
        }
      } catch (err) {
        console.error("Network error:", err);
        setError("An error occurred while fetching courses.");
      }
    };

    fetchCourses();
  }, [noPekerja]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div>
      <h1>Courses Taught by Lecturer {noPekerja}</h1>
      {courses.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Session</th>
              <th>Semester</th>
              <th>Section</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index}>
                <td>{course.kod_subjek}</td>
                <td>{course.nama_subjek}</td>
                <td>{course.sesi}</td>
                <td>{course.semester}</td>
                <td>{course.seksyen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No courses found for the specified lecturer.</p>
      )}
    </div>
  );
}
