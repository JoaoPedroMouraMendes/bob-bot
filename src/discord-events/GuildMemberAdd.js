class GuildMemberAdd {
    async newUser(member) {
        // Manda boas vindas no primeiro canal de texto
        const channel = member.guild.channels.cache.find(channel => channel.type === 0);
        if (channel)
            await channel.send(`${member} chegou!`);
    }

    main({ client, member }) {
        this.newUser(member);
    }
}

module.exports = new GuildMemberAdd();