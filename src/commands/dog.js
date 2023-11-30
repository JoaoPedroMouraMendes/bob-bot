const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const pallete = require("../../settings.json").palette;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dog")
        .setDescription("Auu Auu!"),
    async execute({ interaction }) {
        // Feedback de busca
        const feedbackEmbed = new EmbedBuilder()
            .setColor(pallete.warning)
            .setTitle("A procura do seu doguinho!")
            .setDescription("Estamos buscando seu cachorro...");
        await interaction.reply({ embeds: [feedbackEmbed] });
        // Consulta a API de cachorros
        const response = await fetch("https://api.thedogapi.com/v1/images/search")
            .then(response => response.json())
            .catch(error => console.error(`Erro ao tentar consultar a API de cachorros: ${error}`));
        // Resultado
        const responseEmbed = new EmbedBuilder()
            .setColor(pallete.success)
            .setTitle("Aqui está 🐶")
            .setImage(response[0].url);
        await interaction.editReply({ embeds: [responseEmbed] });
    }
}