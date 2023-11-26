//* Esse script é para resetar os slash commands de todos os servidores

const { REST, Routes } = require("discord.js");
const getCommands = require("./getCommands.js");
const Database = require("./Database.js");
require("dotenv").config();

// SlashCommands
const commands = getCommands().map(command => command.data.toJSON());
// Instância REST
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

const database = new Database();

(async () => {
    try {
        console.log(`Atualizando ${commands.length} comandos...`);
        // Adiciona o slashCommands a todos os servidores desse bot
        await database.getAllGuilds().forEach(async guild => {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.guild_id),
                { body: commands }
            );
        });
        console.log("Comandos registrados com sucesso");
    } catch (error) {
        console.error(`Erro ao tentar adicionar slashCommands: ${error}`);
    }
})();