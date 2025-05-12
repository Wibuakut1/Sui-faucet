const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('faucet')
    .setDescription('Kirimkan SUI testnet faucet ke alamat wallet')
    .addStringOption(option =>
      option.setName('address')
        .setDescription('Alamat wallet SUI (0x...)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const walletAddress = interaction.options.getString('address');

    if (!walletAddress.startsWith('0x') || walletAddress.length !== 66) {
      return interaction.reply({ content: 'Alamat tidak valid.', ephemeral: true });
    }

    try {
      await axios.post(`https://faucet.testnet.sui.io/gas`, {
        FixedAmountRequest: {
          recipient: walletAddress
        }
      });

      await interaction.reply(`Berhasil mengirim SUI faucet ke ${walletAddress}`);
    } catch (error) {
      console.error(error.response?.data || error.message);
      await interaction.reply('Gagal mengirim faucet. Coba lagi nanti.');
    }
  }
};
