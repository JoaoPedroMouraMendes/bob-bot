const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const pallete = require("../../settings.json").palette;
const Database = require("../Database.js");
const { Permissions } = require("../CommandController.js");

const database = new Database();
const permissions = new Permissions();

async function addRole(interaction, roleToAdd) {
    // Comunição com o banco de dados para adicionar o cargo
    const dbResponse = await database.addMainRole(interaction.guildId, roleToAdd.name);

    // Caso tenha dado tudo certo no banco de dados
    if (dbResponse) {
        // Resposta
        const successEmbed = new EmbedBuilder()
            .setColor(pallete.success)
            .setTitle(`Cargo ${roleToAdd.name} foi promovido!`)
            .setDescription(`Agora membros com o cargo ${roleToAdd.toString()} podem executar comandos especiais.`)
            .setThumbnail("https://cdn.discordapp.com/attachments/1176844788025282560/1177618050464366674/codigo-aberto.png?ex=65732946&is=6560b446&hm=0ac325fec0cc335387c3a7ecd84007ebfa8dbe6850aa8be21a201ec5fde941bd&");

        return await interaction.reply({ embeds: [successEmbed] });
    }
    // Caso não
    else {
        // Resposta
        const warningEmbed = new EmbedBuilder()
            .setColor(pallete.warning)
            .setTitle(`Erro!`)
            .setDescription(`O cargo ${roleToAdd.toString()} já foi promovido.`)

        return await interaction.reply({ embeds: [warningEmbed], ephemeral: true });
    }
}

async function removeRole(interaction, roleToRemove) {
    // Comunição com o banco de dados para remover o cargo
    const dbResponse = await database.removeMainRole(interaction.guildId, roleToRemove.name);

    // Caso tenha dado tudo certo no banco de dados
    if (dbResponse) {
        // Resposta
        const successEmbed = new EmbedBuilder()
            .setColor(pallete.success)
            .setTitle(`Cargo ${roleToRemove.name} foi rebaixado!`)
            .setDescription(`Agora membros com o cargo ${roleToRemove.toString()} não podem executar comandos especiais.`)
            .setThumbnail("https://cdn.discordapp.com/attachments/1176844788025282560/1177617557579108443/privacidade.png?ex=657328d0&is=6560b3d0&hm=e5efb5bb32ccc264b00a4125c1d6cc12d8dbd2245dd69d6e99f50a8b52909dbb&");

        return await interaction.reply({ embeds: [successEmbed] });
    }
    // Caso não
    else {
        // Resposta
        const warningEmbed = new EmbedBuilder()
            .setColor(pallete.warning)
            .setTitle(`Erro!`)
            .setDescription(`O cargo ${roleToRemove.toString()} ainda não foi promovido.`)

        return await interaction.reply({ embeds: [warningEmbed], ephemeral: true });
    }
}

async function getRoles(interaction, roles) {
    // Obtem os cargos principais
    const mainRoles = await database.getMainRoles(interaction.guildId);

    if (mainRoles.length === 0) {
        // Resposta
        const warningEmbed = new EmbedBuilder()
            .setColor(pallete.warning)
            .setDescription("Não há nenhum cargo principal declarado");

        return await interaction.reply({ embeds: [warningEmbed], ephemeral: true });
    }

    // Filtra os cargos principais
    const filteredRoles = roles.filter(role => mainRoles.includes(role.name));

    // Resposta 
    const successEmbed = new EmbedBuilder()
        .setColor(pallete.success)
        .setTitle("Cargos principais:")
        .setDescription(filteredRoles.map(role => `● ${role}`).join("\n"));

    return await interaction.reply({ embeds: [successEmbed] });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("main-role")
        .setDescription("Gerenciamento dos cargos principais")
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Adiciona cargo")
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription("Cargo desejado para ser promovido")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove cargo")
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription("Cargo desejado para ser rebaixado")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("get")
                .setDescription("Obtem todos os cargos")
        ),

    /* Essa função promove e rebaixa cargos, dando e tirando 
    o direito de poder usar certo comandos desse bot.
    Ela só pode ser usada pelo dono do servidor */
    async execute({ interaction }) {
        // Obtem todos os cargos do servidor
        const roles = interaction.guild.roles.cache
            .filter(_role => !_role.managed)
            .map(_role => _role);

        // Verifica se foi o subcomando get
        if (interaction.options.getSubcommand() === "get") {
            await getRoles(interaction, roles);
            return;
        }

        // Verifica se não foi o dono que usou o comando
        if (!permissions.owner(interaction)) {
            // Resposta
            const warningEmbed = new EmbedBuilder()
                .setColor(pallete.warning)
                .setDescription("Só o dono do servidor pode executar esse comando");

            return await interaction.reply({
                embeds: [warningEmbed],
                ephemeral: true
            });
        }

        //* Set de parametros para os subcommands "add" e "remove"

        // Busca pelo cargo inserido pelo usuário
        const role = await interaction.options.getRole("role", true);

        // Verifica se o cargo existe
        if (!roles.find(_role => _role.name === role.name)) {
            // Resposta
            const warningEmbed = new EmbedBuilder()
                .setColor(pallete.warning)
                .setDescription(`O cargo ${role} não existe!`);

            return await interaction.reply({ embeds: [warningEmbed], ephemeral: true });
        }

        // Verifica qual subcommando foi escolhido
        if (interaction.options.getSubcommand() === "add") {
            await addRole(interaction, role);
            return;
        }
        else if (interaction.options.getSubcommand() === "remove") {
            await removeRole(interaction, role);
            return;
        }
    },
}
