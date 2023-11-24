const Database = require("../Database");

const database = new Database();

class GuildDelete {
    main({ client, guild }) {
        // Remove os dados desse servidor
        database.deleteGuildData(guild);
    }
}

module.exports = new GuildDelete();