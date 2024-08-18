const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setConfig } = require('../utils/database');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ayarlar')
    .setDescription('Bot ayarlarını günceller')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(option => 
      option.setName('satisyetkilisi')
        .setDescription('Satış yetkilisi rolünü ayarlar')
        .setRequired(false))
    .addChannelOption(option => 
      option.setName('satiskanal')
        .setDescription('Satış işlemlerinin yapılacağı kanalı ayarlar')
        .setRequired(false))
    .addChannelOption(option => 
      option.setName('yenisiparislog')
        .setDescription('Yeni sipariş log kanalını ayarlar')
        .setRequired(false))
    .addChannelOption(option => 
      option.setName('tamamlanansiparislog')
        .setDescription('Tamamlanan sipariş log kanalını ayarlar')
        .setRequired(false))
    .addChannelOption(option => 
      option.setName('genellog')
        .setDescription('Genel log kanalını ayarlar')
        .setRequired(false)),
  async execute(interaction) {
    const satisYetkilisi = interaction.options.getRole('satisyetkilisi');
    const satisKanal = interaction.options.getChannel('satiskanal');
    const yeniSiparisLog = interaction.options.getChannel('yenisiparislog');
    const tamamlananSiparisLog = interaction.options.getChannel('tamamlanansiparislog');
    const genelLog = interaction.options.getChannel('genellog');

    if (!satisYetkilisi && !satisKanal && !yeniSiparisLog && !tamamlananSiparisLog && !genelLog) {
      return interaction.reply({ content: 'En az bir ayarı güncellemelisiniz!', ephemeral: true });
    }

    let updatedSettings = [];

    if (satisYetkilisi) {
      await setConfig('satisYetkilisiId', satisYetkilisi.id);
      updatedSettings.push('Satış Yetkilisi Rolü');
    }

    if (satisKanal) {
      await setConfig('satisKanalId', satisKanal.id);
      updatedSettings.push('Satış Kanalı');
    }

    if (yeniSiparisLog) {
      await setConfig('newOrderLogChannelId', yeniSiparisLog.id);
      updatedSettings.push('Yeni Sipariş Log Kanalı');
    }

    if (tamamlananSiparisLog) {
      await setConfig('completedOrderLogChannelId', tamamlananSiparisLog.id);
      updatedSettings.push('Tamamlanan Sipariş Log Kanalı');
    }

    if (genelLog) {
      await setConfig('generalLogChannelId', genelLog.id);
      updatedSettings.push('Genel Log Kanalı');
    }

    await interaction.reply({ content: `Aşağıdaki ayarlar başarıyla güncellendi: ${updatedSettings.join(', ')}`, ephemeral: true });

    // Log gönder
    await sendLog(interaction.client, 'general', 'Ayarlar Güncellendi', `${interaction.user} tarafından şu ayarlar güncellendi: ${updatedSettings.join(', ')}`);
  },
};