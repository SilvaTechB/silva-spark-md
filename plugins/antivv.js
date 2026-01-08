const config = require('../config');
const { cmd } = require('../command');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

cmd({
    pattern: "vv",
    alias: ["viewonce"],
    desc: "Unlock view-once image or video",
    category: "extra",
    react: "👁️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        const pushname = m.pushName || "there";
        const sender = m.sender;

        if (!quoted) {
            return reply("❌ Reply to a *view-once image or video*.");
        }

        let qMsg = quoted.message;

        // 🔥 Properly unwrap view-once containers
        if (qMsg?.viewOnceMessage) {
            qMsg = qMsg.viewOnceMessage.message;
        } else if (qMsg?.viewOnceMessageV2) {
            qMsg = qMsg.viewOnceMessageV2.message;
        } else if (qMsg?.viewOnceMessageV2Extension) {
            qMsg = qMsg.viewOnceMessageV2Extension.message;
        }

        const isImage = qMsg?.imageMessage;
        const isVideo = qMsg?.videoMessage;

        if (!isImage && !isVideo) {
            return reply("❌ That message is not a view-once image or video.");
        }

        const mediaType = isImage ? "image" : "video";

        // 🧠 Build quoted key correctly
        const quotedKey = {
            remoteJid: from,
            id: quoted.key.id,
            participant: quoted.key.participant || sender
        };

        const buffer = await downloadMediaMessage(
            {
                key: quotedKey,
                message: qMsg
            },
            "buffer",
            {},
            { logger: console }
        );

        const caption = `✨ *VIEW-ONCE UNLOCKED*
👤 Requested by: ${pushname}
⚡ SILVA SPARK MD`;

        const mediaMsg =
            mediaType === "image"
                ? { image: buffer, caption }
                : { video: buffer, caption };

        await conn.sendMessage(
            from,
            {
                ...mediaMsg,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 888,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363200367779016@newsletter',
                        newsletterName: "SILVA • VIEWONCE",
                        serverMessageId: Math.floor(Math.random() * 1000)
                    }
                }
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error(error);
        reply(`❌ View-once error:\n${error.message}`);
    }
});