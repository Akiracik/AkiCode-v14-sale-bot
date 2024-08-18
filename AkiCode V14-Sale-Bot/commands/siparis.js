const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { getProduct, createOrder, getConfig } = require('../utils/database');
const { sendLog } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('siparis')
    .setDescription('Ürün siparişi verir')
    .addStringOption(option =>
      option.setName('urun')
        .setDescription('Sipariş vermek istediğiniz ürün')
        .setRequired(true)),
  async execute(interaction) {
    const satisKanalId = await getConfig('satisKanalId');
    if (satisKanalId && interaction.channelId !== satisKanalId) {
      return interaction.reply({ content: 'Bu komut sadece satış kanalında kullanılabilir!', ephemeral: true });
    }

    const productName = interaction.options.getString('urun');
    const product = await getProduct(productName);

    if (!product) {
      return interaction.reply({ content: 'Böyle bir ürün bulunamadı!', ephemeral: true });
    }

    const orderId = await createOrder(interaction.user.id, product);

    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('Sipariş Alındı')
      .setDescription(`${product.name} için siparişiniz alındı.`)
      .addFields(
        { name: 'Ürün', value: product.name },
        { name: 'Fiyat', value: `${product.price} TL` },
        { name: 'Sipariş ID', value: orderId }
      );

    await interaction.reply({ embeds: [embed] });

    // Log gönder
    await sendLog(interaction.client, 'newOrder', 'Yeni Sipariş', `${interaction.user} tarafından yeni bir sipariş verildi.\nÜrün: ${product.name}\nFiyat: ${product.price} TL\nSipariş ID: ${orderId}`);
  },
};