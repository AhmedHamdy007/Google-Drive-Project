// routes/tasks.js
const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// GET all tasks for a user
router.get('/:matricNo', async (req, res) => {
  try {
      const tasks = await Task.find({ matricNo: req.params.matricNo });
      res.status(200).json(tasks);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});


// POST a new task
router.post('/', async (req, res) => {
  try {
      const { matricNo, title, description, priority, date } = req.body;
      if (!matricNo || !title || !date) {
          return res.status(400).json({ error: 'Missing required fields' });
      }
      const task = new Task({ matricNo, title, description, priority, date });
      await task.save();
      res.status(201).json(task);
  } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
  }
});


// PUT (update) a task by ID
router.put('/:taskId', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, {
      new: true,
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update task' });
  }
});

// DELETE a task by ID
router.delete('/:taskId', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
