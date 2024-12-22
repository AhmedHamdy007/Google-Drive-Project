const express = require('express');
const router = express.Router();
const { getUserSubjects } = require('../controllers/userSubjectsController');

// GET /user-subjects
router.get('/user-subjects', getUserSubjects);

module.exports = router;
