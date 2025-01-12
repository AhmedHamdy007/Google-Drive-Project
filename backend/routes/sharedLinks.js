const express = require("express");
const router = express.Router();
const SharedLink = require("../models/SharedLinks");

// POST /api/shared-links - Save a shared link to the database
router.post("/", async (req, res) => {
  try {
    const {
      shared_by,
      shared_with,
      category,
      session,
      subject,
      description,
      resource_url,
    } = req.body;

    // Validate required fields
    if (!shared_by || !shared_with || !category || !session || !subject || !description || !resource_url) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new shared link document
    const newSharedLink = new SharedLink({
      shared_by,
      shared_with,
      category,
      session,
      subject,
      description,
      resource_url,
    });

    // Save to the database
    await newSharedLink.save();

    res.status(201).json({ message: "Resource shared successfully!", data: newSharedLink });
  } catch (error) {
    console.error("Error sharing resource:", error);
    res.status(500).json({ message: "An error occurred while sharing the resource." });
  }
});

module.exports = router;
