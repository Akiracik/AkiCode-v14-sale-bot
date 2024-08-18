const { getProductsByCategory } = require('../utils/database');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Komut yürütülürken bir hata oluştu!', ephemeral: true });
      }
    } else if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'category_select') {
        const selectedCategory = interaction.values[0];
        const products = await getProductsByCategory(selectedCategory);

        if (products.length === 0) {
          return interaction.update({ content: 'Bu kategoride henüz ürün bulunmamaktadır.', components: [] });
        }

        const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle(`${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Kategorisindeki Ürünler`)
          .setDescription('Mevcut ürünler:');

        products.forEach(product => {
          embed.addFields({ name: product.name, value: `Fiyat: ${product.price} TL` });
        });

        await interaction.update({ embeds: [embed], components: [] });
      }
    }
  },
};