exports.up = function (knex) {
    return knex.schema.alterTable('categories', (table) => {
        table.string('user_id').notNullable(); // user_id column
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('categories', (table) => {
        table.dropColumn('user_id');
    });
};