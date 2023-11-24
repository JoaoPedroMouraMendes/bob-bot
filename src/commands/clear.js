const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Exclui tudo de um canal de texto"),

    async execute({ interaction }) {
        await interaction.reply("Limpando...");
    
        const channel = interaction.channel;
        const messages = await channel.messages.fetch();
        channel.bulkDelete(messages);
    }
}