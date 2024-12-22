const express = require('express');
const router = express.Router();
const Test = require('../models/TestModel');

// POST /test - Add a new test document
router.post('/test', async (req, res) => {
    const { name, age } = req.body;

    try {
        const newTest = new Test({ name, age });
        const savedTest = await newTest.save();
        res.status(201).json(savedTest);
    } catch (error) {
        res.status(500).json({ message: 'Error saving data: ' + error.message });
    }
});

// GET /test - Retrieve all test documents
router.get('/test', async (req, res) => {
    try {
        const tests = await Test.find();
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving data: ' + error.message });
    }
});

module.exports = router;
