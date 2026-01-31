// Require the necessary discord.js classes
import type { Client, Interaction, Collection } from "discord.js";
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  MessageFlags,
} = require("discord.js");
const { loadSlashCommands } = require("./helpers/load_commands.ts");
const token = process.env.DISCORD_BOT_TOKEN;

// Create a new client instance
const discordEvents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildMembers,
];
const client = new Client({ intents: discordEvents });

// Log in to Discord with your client's token
client.login(token);

// When the client is ready, run this code (only once).
client.once(Events.ClientReady, (readyClient: Client) => {
  client.commands = new Collection();
  loadSlashCommands(client, __dirname);
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Middleware for client interactions
client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  // Guard Clause for non slash commands
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
    console.log(`/${interaction.commandName} executed sucessfully`);
  } catch (error) {
    console.error(
      `Failed /${interaction.commandName} execution. Error: ${error}`,
    );
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});
