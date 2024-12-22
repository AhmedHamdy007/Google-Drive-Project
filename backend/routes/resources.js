const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// POST /resources - Save a new resource
router.post('/', async (req, res) => {
    const { category, reference_name, session_semester, description, url, uploaded_by } = req.body;

    try {
        const resource = new Resource({
            category,
            reference_name,
            session_semester,
            description,
            url,
            uploaded_by,
        });

        const savedResource = await resource.save();
        res.status(201).json({ message: 'Resource uploaded successfully.', resource: savedResource });
    } catch (error) {
        console.error('Error saving resource:', error.message);
        res.status(500).json({ message: 'Error saving resource: ' + error.message });
    }
});

// GET /resources - Retrieve all resources
router.get('/', async (req, res) => {
    try {
        const resources = await Resource.find(); // Fetch all resources from the database
        res.status(200).json(resources); // Return the resources as a JSON response
    } catch (error) {
        console.error('Error fetching resources:', error.message);
        res.status(500).json({ message: 'Error fetching resources: ' + error.message });
    }
});

// GET /resources/latest - Retrieve the latest 4 resources
router.get('/latest', async (req, res) => {
    try {
        const latestResources = await Resource.find()
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .limit(4); // Limit to the latest 4 resources
        res.status(200).json(latestResources); // Return the latest resources
    } catch (error) {
        console.error('Error fetching latest resources:', error.message);
        res.status(500).json({ message: 'Error fetching latest resources: ' + error.message });
    }
});
module.exports = router;
