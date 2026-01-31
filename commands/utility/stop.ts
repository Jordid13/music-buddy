const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the currently playing song"),
  async execute(interaction) {
    // interaction.guild is the object representing the Guild in which the command was run
    if (!interaction.isCommand()) return;

    // Ensure the member is in a voice channel
    const voiceChannel = interaction.member.voice.channel;
    const connection = getVoiceConnection(voiceChannel.guild.id);

    if (!voiceChannel) {
      return await interaction.reply({
        content: "You are not in a voice channel.",
        ephemeral: true,
      });
    }

    if (connection.joinConfig.channelId !== voiceChannel.id) {
      return await interaction.reply({
        content:
          "You cannot stop music within a voice channel you are not part of.",
        ephemeral: true,
      });
    }

    // TO-DO: Dont kill the connection just the song
    connection.destroy();

    await interaction.reply(`Song stopped sucessfully`);
  },
};
