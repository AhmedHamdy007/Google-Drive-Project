const mongoose = require('mongoose');

const SharedLinkSchema = new mongoose.Schema(
  {
    shared_by: {
      type: String, // Sender's email
      required: true,
    },
    shared_with: {
      type: String, // Receiver's email
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    resource_url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('SharedLink', SharedLinkSchema);
