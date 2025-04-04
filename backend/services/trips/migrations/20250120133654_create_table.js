exports.up = function (knex) {
    return knex.schema.createTable('trip_users', (table) => {
        table.increments('id').primary();
        table.integer('trip_id').unsigned().notNullable();
        table.string('user_id').notNullable();
        table.foreign('trip_id').references('id').inTable('trips').onDelete('CASCADE');
        table.unique(['trip_id', 'user_id']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('trip_users');
};