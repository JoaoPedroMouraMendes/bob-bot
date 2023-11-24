const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const pallete = require("../../settings.json").palette;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Testar funcionamento"),
    async execute({ interaction }) {
        // Resposta formatada
        const response = new EmbedBuilder()
            .setColor(pallete.success)
            .setTitle("Pong!")
            .setDescription("Estou funcionando corretamente, caso fosse essa sua preocupação.")
            .setThumbnail("https://cdn.discordapp.com/attachments/1176844788025282560/1177367941134692452/pingue-pongue.png?ex=65724057&is=655fcb57&hm=656a48e30bb1aedaccf585f4e4a09ae4cf6ee51cf6f775622f91cc5f6a8d7243&");

        return await interaction.reply({ embeds: [response] });
    }
}