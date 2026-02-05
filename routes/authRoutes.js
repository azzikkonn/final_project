const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validate } = require('../middleware/validateMiddleware');
const { registerSchema, loginSchema } = require('../validators/authValidator');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validate(registerSchema), register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validate(loginSchema), login);

module.exports = router;
