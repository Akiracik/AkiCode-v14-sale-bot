const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { getCategories, getProductsByCategory } = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('urunler')
    .setDescription('Mevcut ürünleri kategorilere göre listeler'),
  async execute(interaction) {
    await interaction.deferReply(); // İşlem uzun sürebileceği için yanıtı erteleyelim

    try {
      console.log('Kategoriler alınıyor...');
      const categories = await getCategories();
      console.log('Alınan kategoriler:', categories);

      if (categories.length === 0) {
        return interaction.editReply('Henüz hiç ürün kategorisi bulunmamaktadır.');
      }

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('category_select')
        .setPlaceholder('Bir kategori seçin')
        .addOptions(categories.map(category => ({
          label: category,
          value: category,
        })));

      const row = new ActionRowBuilder().addComponents(selectMenu);

      await interaction.editReply({
        content: 'Lütfen ürünlerini görmek istediğiniz kategoriyi seçin:',
        components: [row],
      });
    } catch (error) {
      console.error('Ürünler komutunda hata:', error);
      await interaction.editReply('Ürünler listelenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  },
};