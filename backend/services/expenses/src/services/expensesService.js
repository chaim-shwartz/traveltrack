const axios = require('axios');
const knex = require('../config/knex');


const fetchExpenses = async (tripCategories, tripId) => {
    try {

        // Transform categories list into a map { id: name }
        const categoryMap = tripCategories.reduce((acc, category) => {
            acc[category.id] = category.name;
            return acc;
        }, {});
        console.log(categoryMap);

        // Fetch expenses from the database
        const expenses = await knex('expenses')
            .where({ trip_id: tripId })
            .select(
                'expenses.id',
                'expenses.trip_id as tripId',
                'expenses.amount',
                'expenses.description',
                knex.raw("TO_CHAR(expenses.date, 'YYYY-MM-DD') as date"),
                'expenses.category_id as categoryId'
            )
            .orderBy('expenses.date', 'asc');

        // Add category names to expenses
        const enrichedExpenses = expenses.map((expense) => ({
            ...expense,
            categoryName: categoryMap[expense.categoryId] || 'Unknown Category',
        }));

        return enrichedExpenses;
    } catch (error) {
        console.error('Error fetching expenses with categories:', error);
        throw new Error('Failed to fetch expenses with categories');
    }
};

const createExpense = async ({ tripId, categoryId, amount, description, date }) => {
    const utcDate = new Date(date).toISOString();
    const [id] = await knex('expenses').insert({ trip_id: tripId, category_id: categoryId, amount, description, date: utcDate }).returning('id');
    return id;
};

const editExpense = async (id, { amount, description, date, categoryId }) => {
    await knex('expenses')
        .where({ id })
        .update({ amount, description, date, category_id: categoryId });
};

const removeExpense = async (id) => {
    await knex('expenses').where({ id }).del();
};

const categoriesFromExpenses = async (serviceToken, tripId) => {
    const categoriesInExpenses = await knex('expenses')
        .where({ trip_id: tripId })
        .select(
            'expenses.category_id as categoryId'
        ).distinct()
    const categoryIds = categoriesInExpenses.map(category => category.categoryId);

    // Fetch categories from Categories Service using Service Token
    const { data: categories } = await axios.post(`${process.env.CATEGORIES_SERVICE_URL}/categories/bulk`, { categoryIds }, {
        headers: { Authorization: `Bearer ${serviceToken}` },
    });
    return categories;
}

module.exports = { fetchExpenses, createExpense, editExpense, removeExpense, categoriesFromExpenses };