const deployCommands = require("../deployCommads.js");
const DataBase = require("../DataBase");

const dataBase = new DataBase();

class GuildCreate {
    async botPresentation(guild) {
        // Se apresenta ao entrar no servidor
        const channel = guild.channels.cache.find(channel => channel.type === 0);
        if (channel)
            await channel.send(`Olá`);
    }

    main({ client, guild }) {
        // Adição do slashCommands
        deployCommands(guild.id);
        // Cadastra o servidor ao banco de dados
        dataBase.createData(guild);

        this.botPresentation(guild);
    }
}

module.exports = new GuildCreate();