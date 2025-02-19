exports.up = function (knex) {
    return knex.schema.table('trips', (table) => {
        table.string('image'); // Adding the image column
    });
};

exports.down = function (knex) {
    return knex.schema.table('trips', (table) => {
        table.dropColumn('image'); // Remove the column if needed
    });
};
