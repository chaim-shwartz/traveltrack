const express = require('express');
const passport = require('../services/googleAuthService'); // Google OAuth service
const { googleLogin, generateServiceToken } = require('../controllers/authController'); // Auth controller functions
const authenticateService = require('../middlewares/authenticateService');

const router = express.Router();

// Google OAuth - Redirect user to Google for authentication
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account', // Force account selection
}));

// Google OAuth - Callback route after Google authentication
router.get('/google/callback', passport.authenticate('google', { session: false }), googleLogin);

// Endpoint to request a Service Token for inter-service communication
router.post('/service-token', authenticateService, generateServiceToken);

module.exports = router;