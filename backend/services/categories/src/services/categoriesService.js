const knex = require('../config/knex');

const fetchCategories = async (user) => {
    const userId = user.id;
    return await knex('categories').where({ user_id: userId }).orWhere({ user_id: "all" }).select(
        "id",
        "name",
        "user_id as userId"
    )

    // if (req.service) {
    //     // Request from a service
    //     console.log(req.query.categoryIds);

    //     return await knex('categories').select('*');
    // }
};
const fetchCategoriesByIds = async (categoryIds) => {
    return await knex('categories')
        .whereIn('id', categoryIds) // Returns only categories with the matching ID
        .select(
            "id",
            "name",
        ); 
};




const createCategory = async (userId, name) => {
    const [id] = await knex('categories').insert({ user_id: userId, name }).returning('id');
    return id.id;
};

module.exports = { fetchCategories, createCategory, fetchCategoriesByIds };
