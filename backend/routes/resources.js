const express = require('express');
const Resource = require('../models/Resource'); // Your Resource model
const router = express.Router();

// POST /resources - Save a new resource
router.post('/', async (req, res) => {
  const { category, reference_name, session, semester, description, url, uploaded_by, course } = req.body;

  try {
    const resource = new Resource({
      category,
      reference_name,
      session,
      semester,
      description,
      url,
      uploaded_by,
      course,  // Store course code
    });

    const savedResource = await resource.save();
    res.status(201).json({ message: 'Resource uploaded successfully.', resource: savedResource });
  } catch (error) {
    console.error('Error saving resource:', error.message);
    res.status(500).json({ message: 'Error saving resource: ' + error.message });
  }
});




// GET /api/resources - Retrieve resources based on session, semester, and course

router.get('/', async (req, res) => {
  const { no_matrik, session, semester, courses } = req.query;

  // Log query parameters for debugging
  console.log("Received query parameters:", { no_matrik, session, semester, courses });

  if (!no_matrik || !session || !semester || !courses) {
    return res.status(400).json({ message: 'Matric number, session, semester, and course are required' });
  }

  try {
    const course = courses; // Single course passed in the URL

    // Fetch resources based on session, semester, and the selected course
    const resources = await Resource.find({
      session: session,  // Match the session (e.g., "2024/2025")
      semester: parseInt(semester),  // Match the semester (1 or 2)
      course: course,  // Match the course (single course)
    });

    // Check if no resources are found and return a message with a 200 status code
    if (resources.length === 0) {
      return res.status(200).json({ message: 'No resources found for this session, semester, and course' });
    }

    res.status(200).json(resources); // Return the filtered resources
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Error fetching resources' });
  }
});

module.exports = router;  // Export the router so it can be used in server.js  // Export the router so it can be used in server.js
