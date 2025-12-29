const { cmd } = require('../command');
const config = require('../config');

// ==============================
// 🚫 ANTI-BAD WORD FILTER
// ==============================
cmd({
    on: "body"
}, async (conn, mek, m, {
    from,
    body,
    isGroup,
    isAdmins,
    isBotAdmins,
    reply,
    sender
}) => {
    try {
        // List of bad words to filter
        const badWords = [
            "wtf", "mia", "xxx", "fuck", "sex", 
            "huththa", "pakaya", "ponnaya", "hutto",
            "bitch", "ass", "dick", "pussy", "cunt",
            "shit", "bastard", "damn", "hell"
        ];

        // Only run in groups where bot is admin and user is not admin
        if (!isGroup || isAdmins || !isBotAdmins || config.ANTI_BAD_WORD !== "true") {
            return;
        }

        const messageText = body.toLowerCase();
        const containsBadWord = badWords.some(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'i');
            return regex.test(messageText);
        });

        if (containsBadWord) {
            // Delete the message
            await conn.sendMessage(from, {
                delete: mek.key
            });

            // Send warning message
            await conn.sendMessage(from, {
                text: `🚫 *⚠️ BAD WORD DETECTED ⚠️*\n\n💎 *Silva Spark MD* detected inappropriate language.\n\n👤 *User:* @${sender.split('@')[0]}\n⚠️ *Action:* Message deleted\n📝 *Reminder:* Please maintain respectful communication in this group.`,
                mentions: [sender]
            }, {
                quoted: mek
            });

            console.log(`[ANTI-BAD-WORD] Deleted message from ${sender.split('@')[0]} in ${from}`);
        }
    } catch (error) {
        console.error('[ANTI-BAD-WORD ERROR]:', error);
        reply("⚠️ An error occurred while filtering bad words.");
    }
});

// ==============================
// 🔗 ANTI-LINK FILTER
// ==============================
const linkPatterns = [
    // WhatsApp links
    /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
    /^https?:\/\/(www\.)?whatsapp\.com\/channel\/([a-zA-Z0-9_-]+)$/,
    /wa\.me\/\S+/gi,
    
    // Telegram links
    /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,
    
    // YouTube links
    /https?:\/\/(?:www\.)?youtube\.com\/\S+/gi,
    /https?:\/\/youtu\.be\/\S+/gi,
    
    // Social media links
    /https?:\/\/(?:www\.)?facebook\.com\/\S+/gi,
    /https?:\/\/fb\.me\/\S+/gi,
    /https?:\/\/(?:www\.)?instagram\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?x\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?tiktok\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?snapchat\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?pinterest\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi,
    
    // Other platforms
    /https?:\/\/ngl\.link\/\S+/gi,
    /https?:\/\/(?:www\.)?discord\.(?:com|gg)\/\S+/gi,
    /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi,
    /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?medium\.com\/\S+/gi,
    
    // Generic URL pattern (catches most links)
    /https?:\/\/\S+\.\S+/gi
];

cmd({
    on: "body"
}, async (conn, mek, m, {
    from,
    body,
    sender,
    isGroup,
    isAdmins,
    isBotAdmins,
    reply
}) => {
    try {
        // Only run in groups where bot is admin and user is not admin
        if (!isGroup || isAdmins || !isBotAdmins || config.ANTI_LINK !== 'true') {
            return;
        }

        // Check if message contains any link
        const containsLink = linkPatterns.some(pattern => pattern.test(body));

        if (containsLink) {
            // Delete the message
            await conn.sendMessage(from, {
                delete: mek.key
            });

            // Send warning and remove user
            await conn.sendMessage(from, {
                text: `🚫 *⚠️ LINK DETECTED ⚠️*\n\n💎 *Silva Spark MD* detected an unauthorized link.\n\n👤 *User:* @${sender.split('@')[0]}\n⚠️ *Action:* User removed from group\n📝 *Reason:* Links are not allowed in this group.`,
                mentions: [sender]
            }, {
                quoted: mek
            });

            // Remove user from group
            await conn.groupParticipantsUpdate(from, [sender], "remove");

            console.log(`[ANTI-LINK] Removed ${sender.split('@')[0]} from ${from} for posting link`);
        }
    } catch (error) {
        console.error('[ANTI-LINK ERROR]:', error);
        
        // If removal fails, just delete message and warn
        if (error.message.includes('forbidden') || error.message.includes('not authorized')) {
            reply("⚠️ I don't have permission to remove members. Please make me an admin.");
        } else {
            reply("⚠️ An error occurred while processing the link.");
        }
    }
});

// ==============================
// 📝 COMMAND: Toggle Anti-Link
// ==============================
cmd({
    pattern: "antilink",
    alias: ["antilinkmode"],
    desc: "Enable or disable anti-link protection",
    category: "group",
    react: "🔗",
    filename: __filename
}, async (conn, mek, m, {
    from,
    args,
    isGroup,
    isAdmins,
    isBotAdmins,
    reply
}) => {
    try {
        if (!isGroup) {
            return reply("❌ This command can only be used in groups.");
        }

        if (!isAdmins) {
            return reply("❌ This command is only for group admins.");
        }

        if (!isBotAdmins) {
            return reply("❌ I need to be an admin to use this feature.");
        }

        const mode = args[0]?.toLowerCase();

        if (!mode || !["on", "off"].includes(mode)) {
            return reply(`📝 *Anti-Link Status*\n\nCurrent: ${config.ANTI_LINK === 'true' ? '✅ Enabled' : '❌ Disabled'}\n\n*Usage:*\n${config.PREFIX}antilink on\n${config.PREFIX}antilink off`);
        }

        if (mode === "on") {
            config.ANTI_LINK = "true";
            reply("✅ Anti-Link protection has been *ENABLED*\n\nAll links will be deleted and users will be removed.");
        } else {
            config.ANTI_LINK = "false";
            reply("❌ Anti-Link protection has been *DISABLED*\n\nUsers can now share links freely.");
        }
    } catch (error) {
        console.error('[ANTILINK COMMAND ERROR]:', error);
        reply("❌ An error occurred while toggling anti-link.");
    }
});

// ==============================
// 📝 COMMAND: Toggle Anti-Bad Word
// ==============================
cmd({
    pattern: "antibadword",
    alias: ["antibad", "antiswear"],
    desc: "Enable or disable bad word filter",
    category: "group",
    react: "🚫",
    filename: __filename
}, async (conn, mek, m, {
    from,
    args,
    isGroup,
    isAdmins,
    isBotAdmins,
    reply
}) => {
    try {
        if (!isGroup) {
            return reply("❌ This command can only be used in groups.");
        }

        if (!isAdmins) {
            return reply("❌ This command is only for group admins.");
        }

        if (!isBotAdmins) {
            return reply("❌ I need to be an admin to use this feature.");
        }

        const mode = args[0]?.toLowerCase();

        if (!mode || !["on", "off"].includes(mode)) {
            return reply(`📝 *Anti-Bad Word Status*\n\nCurrent: ${config.ANTI_BAD_WORD === 'true' ? '✅ Enabled' : '❌ Disabled'}\n\n*Usage:*\n${config.PREFIX}antibadword on\n${config.PREFIX}antibadword off`);
        }

        if (mode === "on") {
            config.ANTI_BAD_WORD = "true";
            reply("✅ Bad word filter has been *ENABLED*\n\nInappropriate messages will be deleted automatically.");
        } else {
            config.ANTI_BAD_WORD = "false";
            reply("❌ Bad word filter has been *DISABLED*");
        }
    } catch (error) {
        console.error('[ANTIBADWORD COMMAND ERROR]:', error);
        reply("❌ An error occurred while toggling bad word filter.");
    }
});
