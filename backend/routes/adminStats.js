const express = require("express");
const router = express.Router();
const User = require("../models/User");
const CategorySession = require("../models/CategorySession");
const SharedLink = require("../models/SharedLinks");

// GET /api/admin/stats - Get admin dashboard stats
router.get("/stats", async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find({}, "full_name email");

    // Fetch categories and sessions
    const categorySession = await CategorySession.findOne();

    // Extract categories and sessions
    const categories = categorySession ? categorySession.categories : [];
    const sessions = categorySession ? categorySession.sessions : [];

    // Fetch the latest 5 links sent to the admin
    const latestLinks = await SharedLink.find({ shared_with: "admin@utm.my" })
      .sort({ createdAt: -1 })
      .limit(5);

    // Return the admin dashboard data
    res.status(200).json({
      users,
      categories,
      sessions,
      latestLinks,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Failed to fetch admin stats." });
  }
});

module.exports = router;
