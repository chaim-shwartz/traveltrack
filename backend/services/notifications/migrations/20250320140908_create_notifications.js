exports.up = function (knex) {
    return knex.schema.createTable("notifications", (table) => {
        table.increments("id").primary();
        table.integer("user_id").notNullable();
        table.string("message").notNullable();
        table.boolean("is_read").defaultTo(false);
        table.string("trip_id").notNullable();
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("notifications");
};