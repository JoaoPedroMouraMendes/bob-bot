const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder,
    ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const pallete = require("../../settings.json").palette;

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
                        .setName("target")
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
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute({ interaction }) {
        // Mensagens do canal
        const channel = interaction.channel;

        //* Subcomandos
        switch (interaction.options.getSubcommand()) {
            // Exclui todas as mensagens do canal
            case "all": {
                await interaction.deferReply({ ephemeral: true });
                // Manda primeiro uma mensagem de verificação
                const warningEmbed = new EmbedBuilder()
                    .setColor(pallete.warning)
                    .setTitle("ATENÇÃO!")
                    .setDescription(`Você está prestes a deletar TODAS as mensagens desse canal. Caso esteja ciente do que está fazendo, confirme precionando o botão "Confirmar".\n
                    OBS: Você tem 15 segundos para confirmar.`);
                // Botões
                const confirmButton = new ButtonBuilder()
                    .setCustomId("confirm")
                    .setLabel("Confirmar")
                    .setStyle(ButtonStyle.Danger);
                const cancelButton = new ButtonBuilder()
                    .setCustomId("cancel")
                    .setLabel("Cancelar")
                    .setStyle(ButtonStyle.Secondary);
                const row = new ActionRowBuilder()
                    .addComponents(confirmButton, cancelButton);

                const response = await interaction.editReply({
                    embeds: [warningEmbed],
                    components: [row],
                    ephemeral: true,
                });

                try {
                    //* Espera a resposta do usuário dentro de 15 segundos
                    //* Se ele não responder, esse código vai para o catch
                    const confirmation = await response.awaitMessageComponent({ time: 15_000 });
                    //* Confirmação do usuário
                    if (confirmation.customId === "confirm") {
                        // Feedback
                        const feedbackEmbed = new EmbedBuilder()
                            .setColor(pallete.warning)
                            .setDescription("Excluindo mensagens...")
                        // Resposta de feedback
                        await interaction.editReply({
                            embeds: [feedbackEmbed],
                            components: []
                        });

                        // Faz o discord esperar mais tempo
                        await confirmation.deferUpdate();

                        // Exclusão das mensagens
                        const messages = await channel.messages.fetch();
                        await channel.bulkDelete(messages);

                        // Mensagem visível para todos
                        const userURL = await interaction.user.displayAvatarURL({
                            format: 'png',
                            dynamic: true,
                            size: 4096
                        });
                        const globalEmbed = new EmbedBuilder()
                            .setColor(pallete.success)
                            .setTitle("Mensagens excluidas!")
                            .setDescription("Todas as mensagens deste canal foram excluidas!")
                            .setAuthor({
                                name: interaction.member.user.username,
                                iconURL: userURL,
                            });
                        await confirmation.followUp({ embeds: [globalEmbed] });

                        // Deleta o feedback
                        await interaction.deleteReply();

                    } else if (confirmation.customId === "cancel") {
                        // Resposta ao cancelamento
                        const cancelEmbed = new EmbedBuilder()
                            .setColor(pallete.success)
                            .setDescription("Comando cancelado!");

                        await confirmation.update({
                            embeds: [cancelEmbed],
                            components: [],
                        });
                    }
                } catch (e) {
                    // Resposta ao tempo esgotado
                    const timerOverEmbed = new EmbedBuilder()
                        .setColor(pallete.success)
                        .setDescription("Tempo esgotado!");

                    await interaction.editReply({
                        embeds: [timerOverEmbed],
                        components: [],
                    });
                }

            }
                break;
            //* Exclui todas as mensagens de um usuário
            case "user": {
                const response = await interaction.deferReply();
                const author = await interaction.options.getUser("user", true);

                // Busca, filtra e deleta as mensagens
                const messages = await channel.messages.fetch();
                const filteredMessages = messages.filter
                    (message => message.author.id === author.id ||
                        message.interaction.id === response.interaction.id);
                await channel.bulkDelete(filteredMessages);
            }
                break;
            //* Exclui todas as mensagens de usuários
            case "only-users": {
                const response = await interaction.deferReply();

                // Busca, filtra e deleta as mensagens
                const messages = await channel.messages.fetch();
                const filteredMessages = messages.filter
                    (message => !message.author.bot ||
                        message?.interaction?.id === response.interaction.id);
                await channel.bulkDelete(filteredMessages);
            }
                break;
            //* Exclui todas as mensagens de bots
            case "only-bots": {
                // Resposta
                await interaction.deferReply();

                // Busca, filtra e deleta as mensagens
                const messages = await channel.messages.fetch();
                const filteredMessages = messages.filter(message => message.author.bot);
                await channel.bulkDelete(filteredMessages);
            }
                break;
        }
    }
}
