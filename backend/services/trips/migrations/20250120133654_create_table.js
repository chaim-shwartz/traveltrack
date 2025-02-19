exports.up = function (knex) {
    return knex.schema.createTable('trip_users', (table) => {
        table.increments('id').primary(); // Primary key
        table.integer('trip_id').unsigned().notNullable(); // קשר לטבלה trips
        table.string('user_id').notNullable(); // קשר למשתמש (MongoDB ID)
        table.foreign('trip_id').references('id').inTable('trips').onDelete('CASCADE'); // מחיקת קשרים בעת מחיקת טיול
        table.unique(['trip_id', 'user_id']); // מניעת כפילויות
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('trip_users');
};