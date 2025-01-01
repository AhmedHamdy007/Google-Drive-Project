import axios from "axios";

// Set the base URL for the resources API
const API_BASE_URL = "http://localhost:5000/api/resources";

// Function to fetch resources (with optional filters)
export const fetchResources = async ({ no_matrik, session, semester, course }) => {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: { no_matrik, session, semester, course },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching resources:", error);
    throw new Error("Failed to fetch resources");
  }
};

// Function to fetch resources uploaded by the current user
export const fetchUserResources = async (no_matrik) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user`, {
      params: { no_matrik },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user resources:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch user resources.");
  }
};

// Function to upload a new resource
export const uploadResource = async (linkData) => {
  try {
    const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
    const uploadedBy = userData?.full_name; // Ensure the full name is used for `uploaded_by`
    const noMatrik = userData?.login_name; // Matric number

    if (!uploadedBy || !noMatrik) {
      throw new Error("Unable to identify the current user. Please log in again.");
    }

    // Map frontend fields to backend fields
    const response = await axios.post(API_BASE_URL, {
      category: linkData.category,
      reference_name: linkData.referenceName, // Map referenceName to reference_name
      session: linkData.session,
      semester: linkData.semester,
      course: linkData.course,
      description: linkData.description,
      url: linkData.url,
      uploaded_by: uploadedBy, // Add `uploaded_by` from sessionStorage
      no_matrik: noMatrik, // Add `no_matrik`
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading resource:", error);
    throw new Error("Failed to upload resource");
  }
};


// Function to delete a resource by its ID
export const deleteResource = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`); // Pass _id
    return response.data;
  } catch (error) {
    console.error("Error deleting resource:", error);
    throw new Error("Failed to delete resource");
  }
};

// Function to edit (update) a resource by its ID
export const editResource = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, {
      category: updatedData.category,
      reference_name: updatedData.referenceName,
      session: updatedData.session,
      semester: updatedData.semester,
      course: updatedData.course,
      description: updatedData.description,
      url: updatedData.url,
    });
    return response.data;
  } catch (error) {
    console.error("Error editing resource:", error);
    throw new Error("Failed to edit resource");
  }
};

// Function to fetch a specific resource by its ID
export const fetchResourceById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching resource by ID:", error);
    throw new Error("Failed to fetch resource");
  }
};
