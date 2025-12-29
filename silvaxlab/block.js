const config = require('../config')
const { cmd, commands } = require('../command')
cmd({
    pattern: "block",
    desc: "Block a user.",
    category: "owner",
    react: "🚫",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, quoted, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (!quoted) return reply("❌ Please reply to the user you want to block.");

    const user = quoted.sender;
    try {
        await conn.updateBlockStatus(user, 'block');
        reply('🚫💎 Sɪʟᴠᴀ Sᴘᴀʀᴋ MD 💎 User ' + user + ' blocked successfully.');
    } catch (error) {
        reply('❌ Error blocking user: ' + error.message);
    }
});
