const express = require('express');
const { getExpenses, addExpense, updateExpense, deleteExpense } = require('../controllers/expensesController');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

// Routes for managing expenses
router.get('/trip/:tripId', authenticateJWT, getExpenses);
router.post('/', authenticateJWT, addExpense);
router.put('/:id', authenticateJWT, updateExpense);
router.delete('/:id', authenticateJWT, deleteExpense);

module.exports = router;