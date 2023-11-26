const path = require("node:path");
const fs = require("fs");
const { main } = require("./discord-events/InteractionCreate");

// Caminho até banco de dados
//! Caso mude o local desse script é necessário alterações no segundo parâmetro dessa função
const db = path.join(__dirname, "../db.json");

//* Todas as manipulações para o banco de dados
module.exports = class Database {
    createGuildData(guild) {
        fs.readFile(db, "utf-8", async (error, data) => {
            if (error) {
                console.error(error);
                return;
            }
            // Busca por uma replica, caso encontra não cadrasta o servidor
            // Já que, já está cadrastrado
            const { guild: replica } = await this.getGuildById(guild.id);
            if (replica) {
                console.warn(`O servidor ${guild.name} já é cadastrado`);
                return;
            }

            // Transforma o json em algo manipulável para o js
            const jsonContent = await JSON.parse(data);

            jsonContent.guilds.push({
                guild_id: `${guild.id}`,
                main_roles: [],
            });
            // Converte de volta para JSON
            const updateJson = await JSON.stringify(jsonContent, null, 2);
            // Reescreve o JSON
            fs.writeFile(db, updateJson, "utf-8", error => {
                if (error)
                    console.error(`Houve um erro ao tentar salvar o id do servidor ${guild.name}`);
            });
        });
    }

    deleteGuildData(guild) {
        fs.readFile(db, "utf-8", async (error, data) => {
            if (error) {
                console.error(error);
                return;
            }

            // Transforma o json em algo manipulável para o js
            const jsonContent = await JSON.parse(data);
            // Busca pelo indice do servidor por meio do id dele
            const index = jsonContent.guilds.findIndex(_guild => _guild.guild_id === guild.id);

            if (index !== -1) {
                // Remove o dado
                jsonContent.guilds.splice(index, 1);
                // Volta o dado para JSON
                const updateJson = JSON.stringify(jsonContent, null, 2);
                // Reescreve o JSON
                fs.writeFile(db, updateJson, "utf-8", (error) => {
                    if (error)
                        console.error(`Houve um erro ao tentar excluir dados de um server: ${error}`)
                });
            }
        });
    }

    async addMainRole(id, mainRole) {
        try {
            const data = fs.readFileSync(db, "utf-8")
            const jsonContent = JSON.parse(data);
            const { index } = await this.getGuildById(id);
            const main_roles = jsonContent.guilds[index].main_roles;

            // Verifica a existencia do mesmo cargo antes de adicionar ao db
            if (main_roles.find(role => role === mainRole) && main_roles.length > 0) {
                // Retorna false já que esse cargo já é de main_roles
                return false;
            }
            // Adiciona o cargo ao db
            main_roles.push(mainRole);
            // Volta o dado para JSON
            const updateJson = JSON.stringify(jsonContent, null, 2);
            // Reescreve o JSON
            fs.writeFile(db, updateJson, "utf-8", error => {
                if (error)
                    console.error(`Erro ao tentar reescrever main_roles para json: ${error}`);
            });

        } catch (error) {
            console.error(`Erro ao tentar adicionar cargo a main_roles: ${error}`);
        }

        return true;
    }

    async removeMainRole(id, mainRole) {
        try {
            const data = fs.readFileSync(db, "utf-8")
            const jsonContent = JSON.parse(data);
            const { index } = await this.getGuildById(id);
            const main_roles = jsonContent.guilds[index].main_roles;

            // Busca o cargo a ser removido
            const indexToRemove = main_roles.indexOf(mainRole);
            // Caso o cargo não estiver em main_roles
            if (indexToRemove === -1)
                return false;
            // Remove o cargo
            main_roles.splice(indexToRemove, 1);

            // Volta o dado para JSON
            const updateJson = JSON.stringify(jsonContent, null, 2);
            // Reescreve o JSON
            fs.writeFile(db, updateJson, "utf-8", error => {
                if (error)
                    console.error(`Erro ao tentar reescrever main_roles para json: ${error}`);
            });

        } catch (error) {
            console.error(`Erro ao tentar remover cargo de main_roles: ${error}`);
        }

        return true;
    }

    async getMainRoles(guildId) {
        // Obtem os dados do servidor desejado
        const { guild } = await this.getGuildById(guildId);
        // retorna seus cargos
        return guild.main_roles;
    }

    async getGuildById(guildId) {
        try {
            const data = fs.readFileSync(db, "utf-8");
            const jsonContent = JSON.parse(data);
            // Busca um servidor
            const guild = jsonContent.guilds.find(guild => guild.guild_id === guildId);
            // Busca o index do servidor
            const index = jsonContent.guilds.findIndex(guild => guild.guild_id === guildId);

            return { guild, index };
        } catch (error) {
            console.error(`Erro ao tentar encontrar um servidor: ${error}`);
        }
    }

    getAllGuilds() {
        try {
            const data = fs.readFileSync(db, "utf-8");
            const jsonContent = JSON.parse(data);

            return jsonContent.guilds;
        } catch (error) {
            console.log(`Erro ao tentar obter todos os servidores: ${error}`);
        }
    }
}