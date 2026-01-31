const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song from Youtube")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Youtube URL or valid song name")
        .setRequired(true),
    ),
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    // Ensure the member is in a voice channel
    const voiceChannel = interaction.member.voice.channel;
    const connection = getVoiceConnection(voiceChannel.guild.id);
    const searchQuery = interaction.options.getString("query");

    if (!voiceChannel) {
      return await interaction.reply({
        content: "You are not in a voice channel.",
        ephemeral: true,
      });
    }

    if (!searchQuery) {
      return await interaction.reply({
        content: "You must provide a search query.",
        ephemeral: true,
      });
    }

    // Cant pull bot to another vc without stopping it first
    if (connection && connection.joinConfig.channelId !== voiceChannel.id) {
      return await interaction.reply({
        content:
          "Stop the music bot first before pulling it to another voice channel.",
        ephemeral: true,
      });
    }

    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    await interaction.reply(`Playing a song: ${searchQuery}`);
  },
};
