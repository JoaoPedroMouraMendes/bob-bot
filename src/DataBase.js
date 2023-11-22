const path = require("node:path");
const fs = require("fs");

// Caminho até banco de dados
//! Caso mude o local desse script é necessário alterações no segundo parâmetro dessa função
const db = path.join(__dirname, "../db.json");

//* Todas as manipulações para o banco de dados
module.exports = class DataBase {
    createData(guild) {
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
                guild_id: `${guild.id}`
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

    deleteData(guild) {
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

    async getGuildById(id) {
        try {
            const data = fs.readFileSync(db, 'utf-8');
            const jsonContent = JSON.parse(data);
            // Busca um servidor
            const guild = jsonContent.guilds.find(guild => guild.guild_id === id);
            // Busca o index do servidor
            const index = jsonContent.guilds.findIndex(guild => guild.guild_id === id);

            return { guild, index };
        } catch (error) {
            console.error(`Erro ao tentar encontrar um servidor: ${error}`);
        }
    }
}