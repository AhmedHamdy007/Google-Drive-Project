const express = require('express');
const Resource = require('../models/Resource');
const router = express.Router();

// POST /resources - Save a new resource
router.post('/', async (req, res) => {
  const { category, reference_name, session, semester, description, url, uploaded_by, no_matrik, course } = req.body;

  try {
    const resource = new Resource({
      category,
      reference_name,
      session,
      semester,
      description,
      url,
      uploaded_by,
      no_matrik,
      course,
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
      return res.status(200).json();
    }

    res.status(200).json(resources); // Return the filtered resources
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Error fetching resources' });
  }
});


router.get('/user', async (req, res) => {
  const { no_matrik } = req.query; // Use "no_matrik" for filtering

  // Ensure no_matrik is provided
  if (!no_matrik) {
    return res.status(400).json({ message: 'Matric number (no_matrik) is required.' });
  }

  try {
    // Find resources uploaded by the user with the given no_matrik
    const resources = await Resource.find({ no_matrik });

    // Check if no resources are found
    if (resources.length === 0) {
      return res.status(200).json({ message: 'No resources found for the current user.' });
    }

    res.status(200).json(resources); // Return the user's resources
  } catch (error) {
    console.error('Error fetching user resources:', error);
    res.status(500).json({ message: 'Error fetching user resources.' });
  }
});

// PUT /resources/:id - Update a specific resource by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedResource = await Resource.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found.' });
    }

    res.status(200).json({ message: 'Resource updated successfully.', resource: updatedResource });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ message: 'Error updating resource.' });
  }
});

// DELETE /resources/:id - Delete a specific resource by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedResource = await Resource.findByIdAndDelete(id);

    if (!deletedResource) {
      return res.status(404).json({ message: 'Resource not found.' });
    }

    res.status(200).json({ message: 'Resource deleted successfully.' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ message: 'Error deleting resource.' });
  }
});

module.exports = router;  // Export the router so it can be used in server.js  // Export the router so it can be used in server.js
