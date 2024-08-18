const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { getStats } = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('istatistik')
    .setDescription('Satış istatistiklerini gösterir'),
  async execute(interaction) {
    const stats = await getStats();

    const embed = new EmbedBuilder()
      .setColor('#ff9900')
      .setTitle('Satış İstatistikleri')
      .addFields(
        { name: 'Toplam Satış', value: stats.totalSales.toString() },
        { name: 'Toplam Gelir', value: `${stats.totalRevenue} TL` }
      );

    // En çok satan ürün varsa ekle
    if (stats.bestSeller) {
      embed.addFields({ name: 'En Çok Satan Ürün', value: stats.bestSeller });
    } else {
      embed.addFields({ name: 'En Çok Satan Ürün', value: 'Henüz satış yapılmadı' });
    }

    await interaction.reply({ embeds: [embed] });
  },
};