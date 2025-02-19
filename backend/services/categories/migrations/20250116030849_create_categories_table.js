exports.up = function (knex) {
    return knex.schema.createTable('categories', (table) => {
        table.increments('id').primary(); // Primary key
        table.string('name').notNullable(); // Category name
        table.timestamps(true, true); // created_at and updated_at
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('categories'); // Drop the table if rollback
};
