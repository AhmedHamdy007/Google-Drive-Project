const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const Timetable = require('../models/Timetable'); // Adjust the path if needed

// Fetch timetable entries for a specific user
router.get('/:matricNo', async (req, res) => {
  try {
    const { matricNo } = req.params;
    console.log('Querying for matricNo:', matricNo);

    const timetable = await Timetable.find({ matricNo });
    console.log('Timetable entries fetched:', timetable);

    res.status(200).json(timetable);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ error: 'Failed to fetch timetable' });
  }
});

// Add a new timetable entry
router.post("/", async (req, res) => {
  try {
    const { matricNo, subject, time, day } = req.body;

    if (!matricNo || !subject || !time || !day) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const entry = await Timetable.create(req.body);
    res.status(201).json(entry);
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error('Validation error:', error.message);
      res.status(400).json({ error: 'Invalid data provided.' });
    } else {
      console.error('Error adding timetable entry:', error);
      res.status(500).json({ error: 'Failed to add timetable entry.' });
    }
  }
});


// Update a timetable entry
router.put("/:entryId", async (req, res) => {
  try {
    const { entryId } = req.params;
    const { subject, time, day } = req.body;

    // Validate required fields
    if (!subject || !time || !day) {
      return res.status(400).json({ error: 'Subject, time, and day are required.' });
    }

    const updatedEntry = await Timetable.findByIdAndUpdate(
      entryId,
      { subject, time, day, location: req.body.location }, // Explicit fields to update
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ error: 'Timetable entry not found' });
    }

    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error('Error updating timetable entry:', error);
    res.status(500).json({ error: 'Failed to update timetable entry' });
  }
});


// Delete a timetable entry
router.delete("/:entryId", async (req, res) => {
  try {
    const { entryId } = req.params;

    console.log(`Deleting timetable entry with ID: ${entryId}`);

    const deletedEntry = await Timetable.findByIdAndDelete(entryId);

    if (!deletedEntry) {
      return res.status(404).json({ error: 'Timetable entry not found' });
    }

    console.log('Timetable entry deleted:', deletedEntry);
    res.status(200).json({ message: 'Timetable entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting timetable entry:', error);
    res.status(500).json({ error: 'Failed to delete timetable entry' });
  }
});

module.exports = router;
