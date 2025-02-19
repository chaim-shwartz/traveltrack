const { fetchCategories, createCategory, fetchCategoriesByIds } = require('../services/categoriesService');

// const getCategories = async (req, res) => {
//     try {
//         const categories = await fetchCategories(req.body.userId);
//         res.status(200).json(categories);
//     } catch (error) {
//         console.error('Failed to fetch categories:', error);
//         res.status(500).json({ error: 'Failed to fetch categories' });
//     }
// };

// const addCategory = async (req, res) => {
//     const { name } = req.body;

//     if (!name) {
//         return res.status(400).json({ error: 'Name is required' });
//     }

//     try {
//         const id = await createCategory(req.user.id, name);
//         res.status(201).json({ id, name });
//     } catch (error) {
//         console.error('Failed to add category:', error);
//         res.status(500).json({ error: 'Failed to add category' });
//     }
// };

// module.exports = { getCategories, addCategory };



const knex = require('../config/knex');

// Get categories based on user or service authentication
const getCategories = async (req, res) => {
    try {
        const categories = await fetchCategories(req.user);
        res.status(200).json(categories);
    } catch (error) {
        console.error('Failed to fetch categories:', error.message);
        return res.status(500).json({ error: 'Failed to fetch categories' });
    }
};
const getCategoriesByIds = async (req, res) => {
    try {
        const { categoryIds } = req.body;
        const categories = await fetchCategoriesByIds(categoryIds);
        res.status(200).json(categories);
    } catch (error) {
        console.error('Failed to fetch categories:', error.message);
        return res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

const addCategory = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        const id = await createCategory(userId, name);
        res.status(201).json({ id, name });
    } catch (error) {
        console.error('Failed to add category:', error.message);
        res.status(500).json({ error: 'Failed to add category' });
    }
};

module.exports = { getCategories, addCategory, getCategoriesByIds };