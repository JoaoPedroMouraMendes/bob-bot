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
                        // Filta mensagens que tem no máximo 10 dias
                        const filteredMenssages = await messages.filter(msg => IsWithinDaysThreshold(msg));
                        await channel.bulkDelete(filteredMenssages);

                        // Mensagem visível para todos
                        const userURL = await interaction.user.displayAvatarURL({
                            format: 'png',
                            dynamic: true,
                            size: 4096
                        });
                        const globalEmbed = new EmbedBuilder()
                            .setColor(pallete.success)
                            .setTitle("Mensagens excluidas!")
                            .setDescription("Todas as mensagens com 12 dias ou menos de existencia foram excluidas deste canal!")
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
                try {
                    await interaction.deferReply();
                    const author = await interaction.options.getUser("target", true);

                    // Busca e filtra as mensagens
                    const messages = await channel.messages.fetch();
                    const filteredMessages = await messages.filter
                        (msg => msg?.author?.id === author.id &&
                            msg?.interaction?.id !== interaction.id &&
                            IsWithinDaysThreshold(msg));
                    // Verifica se alguma mensagem foi filtrada
                    if (filteredMessages.size == 0) {
                        const warningEmbed = new EmbedBuilder()
                            .setColor(pallete.warning)
                            .setDescription(`O usuário ${author} não tem mensagens neste canal ou suas mensagens não podem ser excluidas!`);

                        await interaction.editReply({ embeds: [warningEmbed] });
                        return;
                    } else
                        await channel.bulkDelete(filteredMessages);

                    const resEmbed = new EmbedBuilder()
                        .setColor(pallete.success)
                        .setDescription(`Todas as mensagens do ${author} criadas dentro de 12 dias foram excluidas!`);
                    await interaction.editReply({ embeds: [resEmbed] });

                } catch (error) {
                    console.error(`Ocorreu um erro no comando clear user: ${error}`);

                    // Erro ao executar o comando
                    const errorEmbed = new EmbedBuilder()
                        .setColor(pallete.error)
                        .setDescription("Ops! Ocorreu um erro.");

                    await interaction.editReply({
                        embeds: [errorEmbed],
                        components: [],
                    });
                }
            }
                break;
            //* Exclui todas as mensagens de usuários
            case "only-users": {
                try {
                    await interaction.deferReply();

                    // Busca e filtra as mensagens
                    const messages = await channel.messages.fetch();
                    const filteredMessages = messages.filter
                        (msg => !msg.author.bot &&
                            msg?.interaction?.id !== interaction.id &&
                            IsWithinDaysThreshold(msg));
                    // Verifica se alguma mensagem foi filtrada
                    if (filteredMessages.size == 0) {
                        const warningEmbed = new EmbedBuilder()
                            .setColor(pallete.warning)
                            .setDescription(`Não tem mensagens de usuários neste canal ou suas mensagens não podem ser excluidas!`);

                        await interaction.editReply({ embeds: [warningEmbed] });
                        return;
                    } else
                        await channel.bulkDelete(filteredMessages);

                    const resEmbed = new EmbedBuilder()
                        .setColor(pallete.success)
                        .setDescription(`Todas as mensagens dos usuários criadas dentro de 12 dias foram excluidas!`);
                    await interaction.editReply({ embeds: [resEmbed] });

                } catch (error) {
                    console.error(`Ocorreu um erro no comando clear only-users: ${error}`);
                    // Erro ao executar o comando
                    const errorEmbed = new EmbedBuilder()
                        .setColor(pallete.success)
                        .setDescription("Ops! Ocorreu um erro.");

                    await interaction.editReply({
                        embeds: [errorEmbed],
                        components: [],
                    });
                }
            }
                break;
            //* Exclui todas as mensagens de bots
            case "only-bots": {
                try {
                    // Resposta
                    await interaction.deferReply();

                    // Busca e filtra as mensagens
                    const messages = await channel.messages.fetch();
                    const filteredMessages = messages.filter(msg => msg.author.bot &&
                        msg?.interaction?.id !== interaction.id &&
                        IsWithinDaysThreshold(msg));

                    // Verifica se alguma mensagem foi filtrada
                    if (filteredMessages.size == 0) {
                        const warningEmbed = new EmbedBuilder()
                            .setColor(pallete.warning)
                            .setDescription(`Não tem mensagens de bots neste canal ou suas mensagens não podem ser excluidas!`);

                        await interaction.editReply({ embeds: [warningEmbed] });
                        return;
                    } else
                        await channel.bulkDelete(filteredMessages);

                    const resEmbed = new EmbedBuilder()
                        .setColor(pallete.success)
                        .setDescription(`Todas as mensagens dos bots criadas dentro de 12 dias foram excluidas!`);
                    await interaction.editReply({ embeds: [resEmbed] });

                } catch (error) {
                    console.error(`Ocorreu um erro no comando clear only-bots: ${error}`);
                    // Erro ao executar o comando
                    const errorEmbed = new EmbedBuilder()
                        .setColor(pallete.success)
                        .setDescription("Ops! Ocorreu um erro.");

                    await interaction.editReply({
                        embeds: [errorEmbed],
                        components: [],
                    });
                }
            }
                break;
        }
    }
}

function IsWithinDaysThreshold(msg) {
    const limitedDay = 12;
    return (Date.now() - msg.createdTimestamp) < (limitedDay * 24 * 60 * 60 * 1000);
}