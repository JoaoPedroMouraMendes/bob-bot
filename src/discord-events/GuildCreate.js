const CommandController = require("../CommandController.js");
const commandController = new CommandController();

class GuildCreate {
    //* Se apresenta no primeiro canal de texto
    async botPresentation(guild) {
        // Busca o primeiro canal de texto
        const channel = guild.channels.cache.find(channel => channel.type === 0 &&
            channel.rawPosition === 0);
        if (channel)
            await channel.send(`Olá`);
    }

    async main({ client, guild }) {
        // Adição do slashCommands
        await commandController.deployCommands(guild.id);

        await this.botPresentation(guild);
    }
}

module.exports = new GuildCreate();