const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const pallete = require("../../settings.json").palette;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cat")
        .setDescription("Gatuuss!"),
    async execute({ interaction }) {
        // Feedback de busca
        const feedbackEmbed = new EmbedBuilder()
            .setColor(pallete.warning)
            .setTitle("A procura de um gato!")
            .setDescription("Estamos buscando seu gatinho...");
        await interaction.reply({ embeds: [feedbackEmbed] });
        // Consulta a API de gatos
        const response = await fetch("https://api.thecatapi.com/v1/images/search")
            .then(response => response.json())
            .catch(error => console.error(`Erro ao tentar consultar a API de gatos: ${error}`));
        // Resultado
        const responseEmbed = new EmbedBuilder()
            .setColor(pallete.success)
            .setTitle("Gatuu :3")
            .setImage(response[0].url);
        await interaction.editReply({ embeds: [responseEmbed] });
    }
}