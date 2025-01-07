const express = require('express');
const SharedLink = require('../models/SharedLinks'); // Import the SharedLinks model
const router = express.Router();

// POST /api/sharedLinks/share
router.post('/share', async (req, res) => {
  const { shared_by, shared_with, subject, message, resource_url } = req.body;

  if (!shared_by || !shared_with || !subject || !message || !resource_url) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Create a shared link for each recipient
    const links = shared_with.map((email) => ({
      shared_by,
      shared_with: email,
      subject,
      message,
      resource_url,
    }));

    // Save all links to the database
    await SharedLink.insertMany(links);

    res.status(201).json({ message: 'Links shared successfully.' });
  } catch (error) {
    console.error('Error sharing links:', error);
    res.status(500).json({ message: 'Failed to share links.' });
  }
});


router.get('/inbox', async (req, res) => {
  const { email } = req.query; // Receiver's email from query params

  // Validate the required query parameter
  if (!email) {
    return res.status(400).json({ message: 'Receiver email is required.' });
  }

  try {
    // Retrieve all links where the logged-in user is the recipient
    const links = await SharedLink.find({ shared_with: email }).sort({ createdAt: -1 });

    // If no links are found, return an empty array with a 200 status
    if (links.length === 0) {
      return res.status(200).json({ message: 'No shared links found.' });
    }

    // Return the links
    res.status(200).json(links);
  } catch (error) {
    console.error('Error fetching inbox links:', error.message);
    res.status(500).json({ message: 'Failed to fetch inbox links.' });
  }
});

// New endpoint to fetch links shared by the user
router.get('/shared-by-user', async (req, res) => {
  const { email } = req.query; // User's email from query params

  // Validate the required query parameter
  if (!email) {
    return res.status(400).json({ message: 'Sender email is required.' });
  }

  try {
    // Retrieve all links where the logged-in user is the sender
    const links = await SharedLink.find({ shared_by: email }).sort({ createdAt: -1 });

    // Return the links
    res.status(200).json(links);
  } catch (error) {
    console.error('Error fetching shared links:', error.message);
    res.status(500).json({ message: 'Failed to fetch shared links.' });
  }
});
// DELETE /api/sharedLinks/:id - Delete a specific shared link by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLink = await SharedLink.findByIdAndDelete(id);

    if (!deletedLink) {
      return res.status(404).json({ message: 'Shared link not found.' });
    }

    res.status(200).json({ message: 'Shared link deleted successfully.' });
  } catch (error) {
    console.error('Error deleting shared link:', error.message);
    res.status(500).json({ message: 'Failed to delete shared link.' });
  }
});


module.exports = router;
