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
    session_semester: {
        type: String,
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
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Resource', ResourceSchema);
