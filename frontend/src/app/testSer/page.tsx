"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

// Define types for user data
interface UserData {
  session_id: string;
  login_name: string;
  full_name: string;
  email: string;
  description: string;
}

export default function TestSer() {
  const searchParams = useSearchParams();
  const rawData = searchParams.get('data'); // Retrieve the user data from query params

  // Parse the user data
  const userData: UserData | null = rawData ? JSON.parse(rawData) : null;

  useEffect(() => {
    if (userData) {
      console.log('User data loaded:', userData);
      // You can still call any required API or perform any action here
    }
  }, [userData]); // Ensure useEffect runs only when userData changes

  if (!userData) {
    return <p>No user data provided. Please log in.</p>;
  }

  return (
    <div>
      <h1>TestSer Page</h1>
      <h2>User Information</h2>
      <p><strong>Full Name:</strong> {userData.full_name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Session ID:</strong> {userData.session_id}</p>
      <p><strong>Description:</strong> {userData.description}</p>
      <p><strong>Matric No:</strong> {userData.login_name}</p>
    </div>
  );
}
