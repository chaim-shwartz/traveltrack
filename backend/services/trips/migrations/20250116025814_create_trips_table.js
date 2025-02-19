exports.up = function (knex) {
    // Create the 'trips' table
    return knex.schema.createTable('trips', (table) => {
        table.increments('id').primary(); // Primary key
        table.string('name').notNullable(); // Trip name
        table.decimal('budget', 10, 2).notNullable(); // Budget for the trip
        table.date('start_date'); // Start date of the trip
        table.date('end_date'); // End date of the trip
        table.string('user_id').unsigned().notNullable(); // Add user_id column
        table.timestamps(true, true); // created_at and updated_at
    });
};

exports.down = function (knex) {
    // Drop the 'trips' table if it exists
    return knex.schema.dropTableIfExists('trips');
};
