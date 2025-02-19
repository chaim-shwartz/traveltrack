exports.up = function (knex) {
    return knex.schema.createTable('expenses', (table) => {
        table.increments('id').primary(); // Primary key
        table.integer('trip_id').unsigned().notNullable(); //  to 'trips'
        table.decimal('amount', 10, 2).notNullable(); // Expense amount
        table.text('description'); // Description of the expense
        table.date('date').notNullable(); // Date of the expense
        table.timestamps(true, true); // created_at and updated_at
        table.integer('category_id').unsigned() // Add the 'category_id' column
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('expenses');
};
