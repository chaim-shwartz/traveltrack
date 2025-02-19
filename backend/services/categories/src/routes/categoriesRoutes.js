const express = require('express');
const { getCategories, addCategory, getCategoriesByIds } = require('../controllers/categoriesController');
const { combinedAuth } = require('../middleware/authMiddleware'); // Import combined auth middleware

const router = express.Router();

// Routes
router.get('/', combinedAuth, getCategories); // Supports both user and service authentication
router.post('/bulk', combinedAuth, getCategoriesByIds); // Supports both user and service authentication
router.post('/', combinedAuth, addCategory); // Requires user or service authentication

module.exports = router;