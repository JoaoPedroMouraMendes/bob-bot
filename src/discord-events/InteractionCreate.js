class InteractionCreate {
    async processCommands({ client, interaction }) {
        // Faz com que só responde por comandos
        if (!interaction.isCommand() || interaction.user.bot) return;
        // Obtem o comando
        const command = client.commands.get(interaction.commandName);
        if (command)
            try {
                command.execute({ interaction, client });
            } catch (error) {
                console.error(`Erro ao tentar executar o comando ${interaction.commandName}`);
                interaction.reply("Erro ao tentar executar esse comando");
            }
        else {
            console.error("Comando não encontrado");
            interaction.reply("Comando não encontrado");
        }
    }

    main({ client, interaction }) {
        // Processa comandos enviados por um usuário
        this.processCommands({ client, interaction });
    }
}

module.exports = new InteractionCreate();