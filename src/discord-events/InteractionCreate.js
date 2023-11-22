class InteractionCreate {
    processCommands({ client, interaction }) {
        // Evitar interações indesejados
        if (!interaction.isChatInputCommand() || !interaction.isCommand()) return;
        // Objetem o comando
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
        this.processCommands({ client, interaction });
    }
}

module.exports = new InteractionCreate();