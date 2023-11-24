const { Client, Events, IntentsBitField, Collection } = require("discord.js");
const getCommands = require("./src/getCommands.js");
require("dotenv").config();

//* Importação dos eventos
const interactionCreate = require("./src/discord-events/InteractionCreate.js");
const guildMemberAdd = require("./src/discord-events/GuildMemberAdd.js");
const guildDelete = require("./src/discord-events/GuildDelete.js");
const guildCreate = require("./src/discord-events/GuildCreate.js");
const clientReady = require("./src/discord-events/ClientReady.js");

//* Configurações

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages
    ]
});

// Coleção para slashCommands
client.commands = new Collection();
// Adiciona os comandos para o client
getCommands().forEach(command => { client.commands.set(command.data.name, command) });

//* Eventos

// Quando o bot é inicializado
client.once(Events.ClientReady, client => {
    clientReady.main(client);
});

// Ao entrar em um server
client.on(Events.GuildCreate, async guild => {
    guildCreate.main({ client, guild });
});

// Evento para quando o bot é expulso do server
client.on(Events.GuildDelete, guild => {
    guildDelete.main({ client, guild });
});

// Evento para quando uma nova pessoa entra no server
client.on(Events.GuildMemberAdd, async member => {
    guildMemberAdd.main({ client, member });
});

// Evento para os comandos
client.on(Events.InteractionCreate, interaction => {
    interactionCreate.main({ client, interaction });
});

client.login(process.env.TOKEN);