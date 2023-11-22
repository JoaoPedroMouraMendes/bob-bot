class ClientReady {
    botNotification(client) {
        // Notifica que está online
        console.log(`Pronto! Bot ${client.user.username} inicializado`);
    }

    main(client) {
        this.botNotification(client);
    }
}

module.exports = new ClientReady();