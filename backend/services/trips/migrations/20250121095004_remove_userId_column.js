exports.up = function (knex) {
    return knex.schema.table('trips', (table) => {
        table.dropColumn('user_id'); // Removing user_id from trips table
    });
};

exports.down = function (knex) {
    return knex.schema.table('trips', (table) => {
        table.integer('user_id').notNullable(); // Adding user_id back
    });
};
