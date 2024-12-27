import axios from "axios";

// Set the base URL for the resources API
const API_BASE_URL = "http://localhost:5000/api/resources";

// Function to fetch resources based on session, semester, and course
export const fetchResources = async (no_matrik, session, semester, course) => {
  try {
    // Send GET request to the server with query parameters
    const response = await axios.get(API_BASE_URL, {
      params: {
        no_matrik,
        session,
        semester,
        courses: course, // Ensure the course parameter is passed
      },
    });

    // Return the fetched data (resources)
    return response.data;
  } catch (error) {
    console.error("Error fetching resources:", error);
    throw new Error("Failed to fetch resources");
  }
};

// Function to upload resources (saving a new resource)
export const uploadResource = async (linkData) => {
  try {
    // Send POST request to upload a new resource
    const response = await axios.post(API_BASE_URL, {
      category: linkData.category,
      reference_name: linkData.referenceName,
      session: linkData.session,
      semester: linkData.semester,
      course: linkData.course,  // Course code from the input
      description: linkData.description,
      url: linkData.url,
      uploaded_by: "Dr. Lecturer Name", // Replace with dynamic data (e.g., logged-in lecturer name)
    });

    // Return the response data (success message, resource details)
    return response.data;
  } catch (error) {
    console.error("Error uploading resource:", error);
    throw new Error("Failed to upload resource");
  }
};
