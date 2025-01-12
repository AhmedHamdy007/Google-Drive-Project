const express = require("express");
const router = express.Router();
const CategorySession = require("../models/CategorySession");

// GET /api/categories-sessions
router.get("/", async (req, res) => {
  try {
    const categorySession = await CategorySession.findOne();
    res.status(200).json(categorySession || { categories: [], sessions: [] });
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories and sessions." });
  }
});

// POST /api/categories-sessions
router.post("/", async (req, res) => {
  try {
    const { name, access, session } = req.body;
    let categorySession = await CategorySession.findOne();

    if (!categorySession) {
      categorySession = new CategorySession();
    }

    // Add a new category
    if (name && access) {
      categorySession.categories.push({ name, access });
    }

    // Add a new session
    if (session) {
      categorySession.sessions.push(session);
    }

    await categorySession.save();
    res.status(201).json({ message: "Category or session added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error adding category or session." });
  }
});

// PUT /api/categories-sessions
router.put("/", async (req, res) => {
  try {
    const { oldName, newName, access } = req.body;
    let categorySession = await CategorySession.findOne();

    if (!categorySession) {
      return res.status(404).json({ message: "No categories found." });
    }

    const category = categorySession.categories.find((cat) => cat.name === oldName);
    if (category) {
      category.name = newName;
      category.access = access;
    }

    await categorySession.save();
    res.status(200).json({ message: "Category updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error updating category." });
  }
});

// DELETE /api/categories-sessions
router.delete("/", async (req, res) => {
  try {
    const { name, session } = req.body;
    let categorySession = await CategorySession.findOne();

    if (!categorySession) {
      return res.status(404).json({ message: "No categories found." });
    }

    // Delete a category
    if (name) {
      categorySession.categories = categorySession.categories.filter((cat) => cat.name !== name);
    }

    // Delete a session
    if (session) {
      categorySession.sessions = categorySession.sessions.filter((sess) => sess !== session);
    }

    await categorySession.save();
    res.status(200).json({ message: "Category or session deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category or session." });
  }
});

module.exports = router;
