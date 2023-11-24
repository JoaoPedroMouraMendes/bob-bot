const {
    SlashCommandBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder
} = require("discord.js");
const DataBase = require("../DataBase.js");

const dataBase = new DataBase();

async function createRoleMenu(interaction) {
    const roles = interaction.guild.roles.cache
        .filter(_role => !_role.managed)
        .map(_role => _role);


    // Cria a barra de seleção
    const select = new StringSelectMenuBuilder()
        .setCustomId("roles")
        .setPlaceholder("Cargos")
        .addOptions(
            roles.map(role =>
                new StringSelectMenuOptionBuilder()
                    .setLabel(role.name)
                    .setValue(role.name)
            )
        );
    const row = new ActionRowBuilder()
        .addComponents(select);

    return row;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("main-role")
        .setDescription("Gerenciamento das cargos principais")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Adicionar cargo")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remover cargo")
        ),

    async execute({ interaction }) {
        // Verifica qual subcommando foi escolhido
        if (interaction.options.getSubcommand() === "add") {
            // Cria um menu de cargos
            const row = await createRoleMenu(interaction);

            // Resposta formatada
            const warning = new EmbedBuilder()
                .setColor("#FF8E00")
                .setTitle("Importante!")
                .setDescription("Ao selecionar um cargo você está dando liberdade para usuários desse cargo poderem executar comandos especiais")
                .setThumbnail("https://cdn.discordapp.com/attachments/1176844788025282560/1177401836093853827/aviso.png?ex=65725fe8&is=655feae8&hm=137d5ab1d9d9e1c282187cb8aad570e42b07029596e34eea2002e335033c9d04&");
            const guide = new EmbedBuilder()
                .setColor("#4FD4E0")
                .setDescription("Seleciona o cargo desejado:")

            return await interaction.editReply({
                embeds: [warning, guide],
                components: [row],
                ephemeral: true,
            });
        }
        else if (interaction.options.getSubcommand() === "remove") {
            return await interaction.editReply("remove");
        }
    },

    async executeSelectMenu({ interaction, commandBody }) {
        if (commandBody[1] === "add") {
            // Cargo a ser adicionado
            const mainRole = interaction.values[0];
            // Adiciona o cargo ao banco de dados
            await dataBase.addMainRole(interaction.guildId, mainRole);
            // Resposta formatada
            const response = new EmbedBuilder()
                .setColor("#4AF5AD")
                .setTitle(`Cargo ${mainRole} promovido`)
                .setDescription(`Agora membros com o cargo ${mainRole} podem executar comandos especiais.`)
                .setThumbnail("https://cdn.discordapp.com/attachments/1176844788025282560/1177369971496603708/promocao-de-cargo.png?ex=6572423b&is=655fcd3b&hm=be26f6ba9c7705f73bc626d3e986a0dd03e01bfbbd7a01f6c31ad8bf4c44cfff&");

            return await interaction.editReply({ embeds: [response] });
        }
        else if (commandBody[1] === "remove") {
            // Cargo a ser removido
            const mainRole = interaction.values[0];
            // Remove o cargo do banco de dados
            await dataBase.removeMainRole(interaction.guildId, mainRole);
            // Resposta formatada
            const response = new EmbedBuilder()
                .setColor("#4AF5AD")
                .setTitle(`Cargo ${mainRole} foi rebaixdo`)
                .setDescription(`Agora membros com o cargo ${mainRole} não podem executar comandos especiais.`)
                .setThumbnail("https://cdn.discordapp.com/attachments/1176844788025282560/1177369971496603708/promocao-de-cargo.png?ex=6572423b&is=655fcd3b&hm=be26f6ba9c7705f73bc626d3e986a0dd03e01bfbbd7a01f6c31ad8bf4c44cfff&");

            return await interaction.editReply({ embeds: [response] });
        }
    }
}
