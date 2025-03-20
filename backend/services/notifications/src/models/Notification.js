const { Model } = require("objection");
const knex = require("../config/knex");

Model.knex(knex);

class Notification extends Model {
    static get tableName() {
        return "notifications";
    }

    static get idColumn() {
        return "id";
    }
}

module.exports = Notification;