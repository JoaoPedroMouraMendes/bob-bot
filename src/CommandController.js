const { REST, Routes } = require("discord.js");
const path = require("node:path");
const fs = require("node:fs");
require("dotenv").config();

module.exports = class CommandController {
    //* Obtem todos os comandos da pasta "commands"
    getCommands() {
        // Array de todos os comandos
        const commands = [];
        // Busca os arquivos ".js" da pasta "commands"
        const commandsPath = path.join(__dirname, "commands");
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
        // Adiciona os comandos ao "client"
        for (const file of commandFiles) {
            // Pega o caminho do arquivo "file"
            const filePath = path.join(commandsPath, file);
            // Pega o que é exportado desse arquivo
            const command = require(filePath);
            // Verifica se esse arquivo tem "data" e o método "execute"
            if ("data" in command && "execute" in command)
                commands.push(command);
            else
                console.error(`O comando em ${filePath} está faltando "data" ou execute`);
        }

        // Retorna todos os comandos
        return commands;
    }

    //* Implementa os slash commands em um certo servidor
    async deployCommands(guildId) {
        // SlashCommands
        const commands = this.getCommands().map(command => command.data.toJSON());
        // Instância REST
        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
        try {
            console.log(`Implantando ${commands.length} comandos...`);
            // Adiciona o slashCommands a API do discord
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
                { body: commands }
            );
            console.log("Comandos registrados com sucesso");
        } catch (error) {
            console.error(`Erro ao tentar adicionar slashCommands: ${error}`);
        }
    }

    //* Atualiza todos os slash commands em todos os servidores
    async updateCommands() {
        // SlashCommands
        const commands = this.getCommands().map(command => command.data.toJSON());
        // Instância REST
        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
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
    }
}