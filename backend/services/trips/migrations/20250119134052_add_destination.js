exports.up = function (knex) {
    return knex.schema.table('trips', (table) => {
        table.string('destination'); // Adding the destination column
    });
};

exports.down = function (knex) {
    return knex.schema.table('trips', (table) => {
        table.dropColumn('destination'); // Remove the column if needed
    });
};
