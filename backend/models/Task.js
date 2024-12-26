// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    matricNo: { type: String, required: true }, // Matric number as the unique identifier
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    date: { type: Date, required: true },
});

module.exports = mongoose.model('Task', taskSchema);
