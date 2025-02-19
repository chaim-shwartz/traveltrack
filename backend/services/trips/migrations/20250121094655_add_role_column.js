exports.up = function (knex) {
    return knex.schema.table('trip_users', (table) => {
        table.string('role').notNullable().defaultTo('user'); // ערך ברירת מחדל: user
    });
};

exports.down = function (knex) {
    return knex.schema.table('trip_users', (table) => {
        table.dropColumn('role');
    });
};