const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Permissions } = require("../CommandController");
const pallete = require("../../settings.json").palette;

const permissions = new Permissions();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear-messages")
        .setDescription("Exclui mensagens")
        .addSubcommand(subcommand =>
            subcommand
                .setName("all")
                .setDescription("Exclui todas as mensagens desse canal")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("by-username")
                .setDescription("Exclui mensagens de uma usuário especifico")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("Usuário que tera suas mensagens excluidas")
                        .setRequired(true)
                )
        ),

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

        // Mensagens do canal
        const channel = interaction.channel;

        //* Subcomandos
        switch (interaction.options.getSubcommand()) {
            // Exclui todas as mensagens do canal
            case "all":

                // Resposta
                const successEmbed = new EmbedBuilder()
                    .setColor(pallete.success)
                    .setDescription("Limpando...");
                await interaction.reply({ embeds: [successEmbed] });
                // Busca e deleta as mensagens
                const messages = await channel.messages.fetch();
                channel.bulkDelete(messages);

                break;
            // Exclui todas as mensagens de um usuário
            case "by-username":

            const author = await interaction.options.getUser("user", true);
                // Resposta
                const successEmbed2 = new EmbedBuilder()
                    .setColor(pallete.success)
                    .setDescription(`Limpando mensagens de ${author.toString()}...`);
                await interaction.reply({ embeds: [successEmbed2] });

                // Busca e deleta as mensagens
                const messages2 = await channel.messages.fetch();
                const filteredMessages = messages2.filter(message => message.author.id === author.id);
                channel.bulkDelete(filteredMessages);

                break;
        }
    }
}