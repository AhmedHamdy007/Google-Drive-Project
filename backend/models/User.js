const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    matric_number: {
        type: String,
        required: true,
        unique: true, // Prevent duplicate users
    },
    email: {
        type: String,
        required: false, // Email is now optional
        trim: true,      // Automatically trims whitespace
    },
    description: {
        type: String,
    },
    courses_id: [
        {
            type: String, // Reference to Course documents
            ref: 'Course',
        },
    ],
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('User', UserSchema);
