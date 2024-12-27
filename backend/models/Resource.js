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
                return /^https?:\/\/.+$/.test(v); // Validates URL format
            },
            message: props => `${props.value} is not a valid URL!`,
        },
    },
    uploaded_by: {
        type: String, // Stores the lecturer's name or ID
        required: true,
    },
    course: {
        type: String, // Single course code that this resource is associated with
        required: true,
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Resource', ResourceSchema);
