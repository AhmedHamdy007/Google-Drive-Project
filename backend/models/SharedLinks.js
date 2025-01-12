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
    category: {
      type: String, // Category of the shared resource
      required: true,
    },
    session: {
      type: String, // Academic session
      required: true,
    },
    subject: {
      type: String, // Reference name or subject
      required: true,
    },
    description: {
      type: String, // Description of the resource
      required: true,
    },
    resource_url: {
      type: String, // Resource URL
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);



module.exports = mongoose.model('SharedLink', SharedLinkSchema);
