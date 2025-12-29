const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');

// Define the updatecmd command
cmd({
  pattern: 'updatecmd',
  react: '🧞',
  desc: 'Update commands.',
  category: 'owner',
  filename: __filename,
}, async (conn, mek, m, {
  from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber,
  botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName,
  participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
  try {
    // Check if the user is the bot owner
    if (!isOwner) {
      return reply("Only the bot owner can use this command.");
    }

    // Define the directory where plugins are located
    const pluginDir = path.join(__dirname, "../plugins");

    // Check if the plugins directory exists
    if (!fs.existsSync(pluginDir)) {
      return reply("Plugins directory does not exist.");
    }

    const pluginFiles = fs.readdirSync(pluginDir);

    // Load each plugin file asynchronously
    for (const pluginFile of pluginFiles) {
      if (pluginFile.endsWith('.js')) {
        const pluginPath = path.join(pluginDir, pluginFile);

        try {
          // Dynamically require and load each plugin
          require(pluginPath);
          console.log(`Successfully loaded plugin: ${pluginFile}`);
        } catch (err) {
          console.error(`Error loading plugin ${pluginFile}:`, err);
          reply(`Error loading plugin ${pluginFile}: ${err.message}`);
        }
      }
    }

    // Send confirmation that commands were updated
    reply("Commands updated successfully.");
  } catch (error) {
    // Log and display any errors
    console.error("Error updating commands:", error);
    reply("Error updating commands: " + error.message);
  }
});
