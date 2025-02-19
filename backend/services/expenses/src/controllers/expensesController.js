const { fetchExpenses, createExpense, editExpense, removeExpense, categoriesFromExpenses } = require('../services/expensesService');
const axios = require('axios');

const getServiceToken = async () => {
    try {
        const { data } = await axios.post(`${process.env.AUTH_SERVICE_URL}/service-token`, {
            serviceName: 'expenses-service',
        }, {
            headers: {
                'x-api-key': process.env.SERVICE_API_KEY, // Include the API key
            },
        });
        return data.token;
    } catch (error) {
        console.error('Failed to fetch service token:', error.message);
        throw new Error('Failed to fetch service token');
    }
};

const getExpenses = async (req, res) => {
    const { tripId } = req.params;
    const userToken = req.cookies.jwt; // User JWT for authentication

    try {
        // Request a Service Token
        const serviceToken = await getServiceToken();

        // get trip categories
        const tripCategories = await categoriesFromExpenses(serviceToken, tripId)

        // Fetch expenses with the Service Token and User Token
        const expenses = await fetchExpenses(tripCategories, tripId);



        res.status(200).json({expenses,tripCategories});
    } catch (error) {
        console.error('Failed to fetch expenses:', error);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
};

const addExpense = async (req, res) => {
    const { tripId, categoryId, amount, description, date } = req.body;

    if (!tripId || !amount || !date || !categoryId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const id = await createExpense({ tripId, categoryId, amount, description, date });
        res.status(201).json({ id });
    } catch (error) {
        console.error('Failed to add expense:', error);
        res.status(500).json({ error: 'Failed to add expense' });
    }
};

const updateExpense = async (req, res) => {
    const { id } = req.params;
    const { amount, description, date, categoryId } = req.body;

    if (!amount || !date || !categoryId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await editExpense(id, { amount, description, date, categoryId });
        res.status(200).json({ message: 'Expense updated successfully' });
    } catch (error) {
        console.error('Failed to update expense:', error);
        res.status(500).json({ error: 'Failed to update expense' });
    }
};

const deleteExpense = async (req, res) => {
    const { id } = req.params;

    try {
        await removeExpense(id);
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Failed to delete expense:', error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
};

module.exports = { getExpenses, addExpense, updateExpense, deleteExpense };