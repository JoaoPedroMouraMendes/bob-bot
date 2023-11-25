//* Aqui se encontra classes para uso geral dos comandos

const Database = require("./Database");

const database = new Database();

// Controle de permissões
class Permissions {
    // Permissão só para o dono do servidor
    owner(interaction) {
        return interaction.user.id === interaction.guild.ownerId;
    }

    // Permissão para o dono do servidor ou para cargos principais
    async mainRole(interaction) {
        // Caso for o dono já da permissão
         if (this.owner(interaction))
             return true;
        // Verifica se o usuário tem um cargo principal
        const mainRoles = await database.getMainRoles(interaction.guildId);
        return interaction.member.roles.cache.find
        (role => mainRoles.indexOf(role.name) !== -1) ? true : false;
    }
}

module.exports = {
    Permissions,
}