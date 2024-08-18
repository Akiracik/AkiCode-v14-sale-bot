const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { completeOrder, getConfig } = require('../utils/database');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('siparisteslim')
    .setDescription('Bir siparişi teslim edildi olarak işaretler')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option =>
      option.setName('siparis_id')
        .setDescription('Teslim edilen siparişin ID\'si')
        .setRequired(true)),

  async execute(interaction) {
    const siparisId = interaction.options.getString('siparis_id');

    try {
      const siparis = await completeOrder(siparisId);
      if (!siparis) {
        return interaction.reply({ content: 'Belirtilen ID\'ye sahip bir sipariş bulunamadı.', ephemeral: true });
      }

      await interaction.reply({ content: `${siparisId} ID'li sipariş başarıyla teslim edildi olarak işaretlendi.`, ephemeral: true });

      // Log gönder
      await sendLog(interaction.client, 'completedOrder', 'Sipariş Teslim Edildi', `${interaction.user} tarafından ${siparisId} ID'li sipariş teslim edildi olarak işaretlendi.`);
    } catch (error) {
      console.error('Sipariş teslim edilirken bir hata oluştu:', error);
      await interaction.reply({ content: 'Sipariş teslim edilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.', ephemeral: true });
    }
  },
};