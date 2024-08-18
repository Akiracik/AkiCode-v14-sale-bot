const { EmbedBuilder } = require('discord.js');
const { getConfig } = require('./database');

async function sendLog(client, logType, title, description) {
  let channelId;
  switch(logType) {
    case 'newOrder':
      channelId = await getConfig('newOrderLogChannelId');
      break;
    case 'completedOrder':
      channelId = await getConfig('completedOrderLogChannelId');
      break;
    default:
      channelId = await getConfig('generalLogChannelId');
  }

  console.log(`Attempting to send log to channel: ${channelId}`); // Debug log

  if (!channelId) {
    console.log(`No channel ID found for log type: ${logType}`); // Debug log
    return;
  }

  try {
    const logChannel = await client.channels.fetch(channelId);
    if (!logChannel) {
      console.log(`Could not fetch channel with ID: ${channelId}`); // Debug log
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor('#0099ff')
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
    console.log(`Log sent successfully to channel: ${channelId}`); // Debug log
  } catch (error) {
    console.error('Error sending log:', error); // Error log
  }
}

module.exports = { sendLog };