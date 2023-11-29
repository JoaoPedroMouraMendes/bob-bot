const { EmbedBuilder } = require("discord.js");
const pallete = require("../../settings.json").palette;

class GuildMemberRemove {
    //* Notifica a saida de um membro
    async memberExit(member) {
        // Não aceita bots
        if (member.user.bot) return;
        // Busca o primeiro canal de texto
        const channel = member.guild.channels.cache.find(channel => channel.type === 0 &&
            channel.rawPosition === 0);

        if (channel) {
            // Avartar do usuário
            const userURL = await member.user.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 4096
            });
            // Resposta
            const notificationEmbed = new EmbedBuilder()
                .setColor(pallete.warning)
                .setDescription(`${member.user.username} saiu do ${member.guild.name}... Talvez algum dia ele volte...`)
                .setAuthor({
                    name: member.user.username,
                    iconURL: userURL,
                });
            await channel.send({ embeds: [notificationEmbed] });
        }
    }

    async botExit(member) {
        // Não aceita usuários
        if (!member.user.bot) return;
        // Busca o primeiro canal de texto
        const channel = member.guild.channels.cache.find(channel => channel.type === 0 &&
            channel.rawPosition === 0);

        if (channel) {
            // Avartar do bot
            const userURL = await member.user.displayAvatarURL({
                format: 'png',
                dynamic: true,
                size: 4096
            });
            // Resposta
            const notificationEmbed = new EmbedBuilder()
                .setColor(pallete.warning)
                .setDescription(`O bot ${member.user.username} saiu do ${member.guild.name}!`)
                .setAuthor({
                    name: member.user.username,
                    iconURL: userURL,
                });
            await channel.send({ embeds: [notificationEmbed] });
        }
    }

    main({ client, member }) {
        // Não faz nada se for o próprio bot que foi removido
        if (member.id === client.id) return;

        this.memberExit(member);
        this.botExit(member);
    }
}

module.exports = new GuildMemberRemove();