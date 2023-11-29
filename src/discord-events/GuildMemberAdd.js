class GuildMemberAdd {
    //* Manda boas vindas no primeiro canal de texto
    async newUser(member) {
        // Busca o primeiro canal de texto
        const channel = guild.channels.cache.find(channel => channel.type === 0 &&
            channel.rawPosition === 0);
        if (channel)
            await channel.send(`${member} chegou!`);
    }

    main({ client, member }) {
        this.newUser(member);
    }
}

module.exports = new GuildMemberAdd();