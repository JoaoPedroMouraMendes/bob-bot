const { SlashCommandBuilder } = require("discord.js");
const { Permissions } = require("../CommandController");

const permissions = new Permissions();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Exclui tudo de um canal de texto"),

    async execute({ interaction }) {
        // Verifica se o usuário pode executar esse comando
        const havePermission = await permissions.mainRole(interaction);
        if (!havePermission) {
            // Resposta
            const warningEmbed = new EmbedBuilder()
                .setColor(pallete.warning)
                .setDescription("Você não tem permissão para executar esse comando");
            return await interaction.reply({
                embeds: [warningEmbed],
                ephemeral: true
            });
        }

        await interaction.reply("Limpando...");

        const channel = interaction.channel;
        const messages = await channel.messages.fetch();
        channel.bulkDelete(messages);
    }
}