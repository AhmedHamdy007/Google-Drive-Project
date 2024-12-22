const express = require('express');
const router = express.Router();
const { getLecturerCourses } = require('../controllers/lecturerCoursesController');

// GET /lecturer-courses
router.get('/lecturer-courses', getLecturerCourses);

module.exports = router;
