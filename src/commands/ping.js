const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Testar funcionamento"),
    async execute({ interaction }) {
        return await interaction.reply("pong");
    }
}