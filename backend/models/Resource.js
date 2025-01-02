const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    reference_name: {
        type: String,
        required: true,
    },
    session: {
        type: String,
        required: true,
    },
    semester: {
        type: Number,  // Store the semester as 1 or 2
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^https?:\/\/.+$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`,
        },
    },
    uploaded_by: {
        type: String, // Stores the lecturer's name or ID
        required: true,
    },
    no_matrik: { 
        type: String, // Add matric number for precise filtering
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);
