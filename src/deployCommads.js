const { REST, Routes } = require("discord.js");
const getCommands = require("./getCommands.js");
require("dotenv").config();

// SlashCommands
const commands = getCommands().map(command => command.data.toJSON());

// Instância REST
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

// Deploy
module.exports = async function deployCommads(guildId) {
    try {
        console.log(`Resetando ${commands.length} comandos...`);
        // PUT
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
            { body: commands }
        );
        console.log("Comandos registrados com sucesso");
    } catch (error) {
        console.error(`Erro ao tentar adicionar slashCommands: ${error}`);
    }
}