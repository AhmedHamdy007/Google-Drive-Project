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

    // Return success response
    res.status(201).json({ message: "Resource shared successfully!", data: newSharedLink });
  } catch (error) {
    console.error("Error sharing resource:", error);
    res.status(500).json({ message: "An error occurred while sharing the resource." });
  }
});
// GET /api/shared-links/shared-by-user - Get links shared by the current user
router.get("/shared-by-user", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Fetch links shared by the user
    const sharedLinks = await SharedLink.find({ shared_by: email });
    res.status(200).json(sharedLinks);
  } catch (error) {
    console.error("Error fetching shared links:", error);
    res.status(500).json({ message: "An error occurred while fetching shared links." });
  }
});

// DELETE /api/shared-links/:id - Delete a shared link by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the shared link
    const deletedLink = await SharedLink.findByIdAndDelete(id);

    if (!deletedLink) {
      return res.status(404).json({ message: "Shared link not found." });
    }

    res.status(200).json({ message: "Shared link deleted successfully." });
  } catch (error) {
    console.error("Error deleting shared link:", error);
    res.status(500).json({ message: "An error occurred while deleting the shared link." });
  }
});
router.get("/inbox", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Find links that were shared with the user
    const inboxLinks = await SharedLink.find({ shared_with: email });

    if (inboxLinks.length === 0) {
      return res.status(404).json({ message: "No shared links found for this user." });
    }

    res.status(200).json(inboxLinks);
  } catch (error) {
    console.error("Error fetching inbox links:", error);
    res.status(500).json({ message: "An error occurred while fetching inbox links." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLink = await SharedLink.findByIdAndDelete(id);

    if (!deletedLink) {
      return res.status(404).json({ message: "Link not found." });
    }

    res.status(200).json({ message: "Link deleted successfully." });
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).json({ message: "An error occurred while deleting the link." });
  }
});

// PUT /api/shared-links/:id - Update a shared link by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { shared_with, category, session, subject, description, resource_url } = req.body;

    // Validate required fields
    if (!shared_with || !category || !session || !subject || !description || !resource_url) {
      return res.status(400).json({ message: "All fields are required to update the link." });
    }

    // Find and update the shared link
    const updatedLink = await SharedLink.findByIdAndUpdate(
      id,
      { shared_with, category, session, subject, description, resource_url },
      { new: true }
    );

    if (!updatedLink) {
      return res.status(404).json({ message: "Link not found." });
    }

    res.status(200).json({ message: "Link updated successfully.", data: updatedLink });
  } catch (error) {
    console.error("Error updating link:", error);
    res.status(500).json({ message: "An error occurred while updating the link." });
  }
});
// GET /api/shared-links/inbox - Get shared links sent to a specific user
router.get("/inbox", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Find links shared with this email, sorted by the most recent
    const sharedLinks = await SharedLink.find({ shared_with: email }).sort({ createdAt: -1 });

    res.status(200).json(sharedLinks);
  } catch (error) {
    console.error("Error fetching shared links:", error);
    res.status(500).json({ message: "An error occurred while fetching shared links." });
  }
});
module.exports = router;
