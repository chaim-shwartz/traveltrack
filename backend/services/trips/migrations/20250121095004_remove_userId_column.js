exports.up = function (knex) {
    return knex.schema.table('trips', (table) => {
        table.dropColumn('user_id'); // הסרת user_id מטבלת trips
    });
};

exports.down = function (knex) {
    return knex.schema.table('trips', (table) => {
        table.integer('user_id').notNullable(); // הוספת user_id חזרה
    });
};