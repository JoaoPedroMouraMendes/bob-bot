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

    async processSelectMenus({ client, interaction }) {
        // Verifica se foi uma interação com um menu
        if (!interaction.isStringSelectMenu()) return;
        // Faz o discord esperar por mais tempo a resposta do bot
        await interaction.deferReply();
        // Obtem o nome do comando
        const commandBody = interaction.message.interaction.commandName.split(/ +/g);
        // Obtem o comando
        const command = client.commands.get(commandBody[0]);

        try {
            command.executeSelectMenu({ interaction, client, commandBody })
        } catch (error) {
            console.error(`Erro ao tentar executar o função de menu do comando ${interaction.commandBody[0]}`);
            interaction.reply("Ocorreu um erro");
        }
    }

    main({ client, interaction }) {
        // Processa comandos enviados por um usuário
        this.processCommands({ client, interaction });
        // Processa menus de seleção
        this.processSelectMenus({ client, interaction });
    }
}

module.exports = new InteractionCreate();