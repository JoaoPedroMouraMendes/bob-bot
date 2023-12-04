const { EmbedBuilder } = require("discord.js");
const pallete = require("../../settings.json").palette;

class GuildCreate {
    //* Se apresenta no primeiro canal de texto
    async botPresentation(guild) {
        // Busca o primeiro canal de texto
        const channel = guild.channels.cache.find(channel => channel.type === 0 &&
            channel.rawPosition === 0);

        if (channel) {
            // Mensagem de Apresentação
            const presentationEmbed = new EmbedBuilder()
                .setColor(pallete.success)
                .setTitle("Olá!")
                .setDescription("Sou Volo, estou pronto para deixar seu servidor com mais vida!");

            await channel.send({ embeds: [presentationEmbed] });
        }
    }

    async main({ client, guild }) {
        await this.botPresentation(guild);
    }
}

module.exports = new GuildCreate();