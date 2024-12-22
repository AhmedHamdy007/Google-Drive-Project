const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../controllers/authController');

// POST /auth
router.post('/auth', authenticateUser);

module.exports = router;
