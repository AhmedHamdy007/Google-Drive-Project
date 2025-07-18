const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
    full_name: {
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
        required: false,
        trim: true, // Automatically trims whitespace
    },
    description: {
        type: String,
    },
    courses_id: [
        {
            type: String,
            ref: 'Course', // Reference to Course documents
        },
    ],
    isAdmin: {
        type: Boolean,
        default: false, // Regular users are not admins by default
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('User', UserSchema);
