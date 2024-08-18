const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} olarak giriş yapıldı!`);
        
        client.user.setPresence({
            activities: [{ name: 'AkiCode & ParsherCode', type: ActivityType.Streaming, url: 'https://www.twitch.tv/akicode' }],
            status: 'online',
        });

        // Slash komutlarını yükle
        console.log('Slash komutları yükleniyor...');
        await client.deployCommands();
        console.log('Slash komutları başarıyla yüklendi!');
    },
};