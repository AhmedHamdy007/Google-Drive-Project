const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /users/save - Save user data
router.post('/save', async (req, res) => {
    const { full_name, login_name, email, description } = req.body;

    try {
        console.log("Data received from frontend:", req.body); // Debug incoming data

        // Check if the user already exists
        let user = await User.findOne({ matric_number: login_name });

        if (user) {
            console.log("User already exists in database:", user); // Debug existing user
            return res.status(200).json({
                message: 'User already exists in the database.',
                user,
            });
        }

        // Create a new user object
        user = new User({
            name: full_name,            // Map full_name to name
            matric_number: login_name,  // Map login_name to matric_number
            email: email ? email.trim() : null, // Allow email to be null or trimmed
            description: description,   // Map description
        });

        // Save the user in the database
        const savedUser = await user.save();
        console.log("User saved successfully:", savedUser); // Debug saved user

        res.status(201).json({
            message: 'User saved successfully.',
            user: savedUser,
        });
    } catch (error) {
        console.error("Error saving user:", error.message); // Debug error
        res.status(500).json({ message: 'Error saving user: ' + error.message });
    }
});

module.exports = router;
