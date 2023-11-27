const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Permissions } = require("../CommandController");
const pallete = require("../../settings.json").palette;

const permissions = new Permissions();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete-messages")
        .setDescription("Exclui mensagens")
        .addSubcommand(subcommand =>
            subcommand
                .setName("all")
                .setDescription("Exclui todas as mensagens desse canal")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("user")
                .setDescription("Exclui mensagens de uma usuário especifico")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("Usuário que tera suas mensagens excluidas")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("only-users")
                .setDescription("Exclui todas as mensagens de usuários")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("only-bots")
                .setDescription("Exclui todas as mensagens de bots")
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
            case "all": {
                await interaction.deferReply();
                // Busca e deleta as mensagens
                const messages = await channel.messages.fetch();
                await channel.bulkDelete(messages);

                break;
            }
            // Exclui todas as mensagens de um usuário
            case "user": {
                const reply = await interaction.deferReply();
                const author = await interaction.options.getUser("user", true);

                // Busca, filtra e deleta as mensagens
                const messages = await channel.messages.fetch();
                const filteredMessages = messages.filter
                    (message => message.author.id === author.id ||
                        message.interaction.id === reply.interaction.id);
                channel.bulkDelete(filteredMessages);

                break;
            }
            // Exclui todas as mensagens de usuários
            case "only-users": {
                const reply = await interaction.deferReply();

                // Busca, filtra e deleta as mensagens
                const messages = await channel.messages.fetch();
                const filteredMessages = messages.filter
                    (message => !message.author.bot || message.interaction.id === reply.interaction.id);
                channel.bulkDelete(filteredMessages);

                break;
            }
            // Exclui todas as mensagens de bots
            case "only-bots": {
                // Resposta
                await interaction.deferReply();

                // Busca, filtra e deleta as mensagens
                const messages = await channel.messages.fetch();
                const filteredMessages = messages.filter(message => message.author.bot);
                channel.bulkDelete(filteredMessages);
                break;
            }
        }
    }
}