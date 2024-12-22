const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true, // Ensure course codes are unique
    },
    description: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
