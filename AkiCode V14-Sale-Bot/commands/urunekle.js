const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { addProduct } = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('urunekle')
    .setDescription('Yeni bir ürün ekler (Sadece yöneticiler kullanabilir)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option =>
      option.setName('isim')
        .setDescription('Ürünün ismi')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('fiyat')
        .setDescription('Ürünün fiyatı')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('kategori')
        .setDescription('Ürünün kategorisi')
        .setRequired(true)),

  async execute(interaction) {
    const urunIsmi = interaction.options.getString('isim');
    const urunFiyati = interaction.options.getInteger('fiyat');
    const urunKategorisi = interaction.options.getString('kategori');

    if (urunFiyati <= 0) {
      return interaction.reply({ content: 'Ürün fiyatı 0\'dan büyük olmalıdır!', ephemeral: true });
    }

    try {
      await addProduct(urunIsmi, urunFiyati, urunKategorisi);
      await interaction.reply({ content: `"${urunIsmi}" isimli ürün ${urunFiyati} TL fiyatıyla "${urunKategorisi}" kategorisine başarıyla eklendi!`, ephemeral: true });
    } catch (error) {
      console.error('Ürün eklenirken bir hata oluştu:', error);
      await interaction.reply({ content: 'Ürün eklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.', ephemeral: true });
    }
  },
};