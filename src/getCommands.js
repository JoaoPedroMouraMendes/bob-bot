const path = require("node:path");
const fs = require("node:fs");

module.exports = function getCommands() {
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
