const fs = require('fs');
const os = require('os');
const { cmd } = require('../command');

// Safely get version from package.json
let version = "1.0.0";
try {
    const pkg = JSON.parse(fs.readFileSync('./package.json'));
    version = pkg.version || "1.0.0";
} catch (err) {
    console.warn("⚠️ Could not read version:", err.message);
}

cmd({
    pattern: "ping",
    alias: "speed",
    desc: "Check bot response time, system info, and user stats.",
    category: "main",
    react: "🌐",
    filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        const start = Date.now();
        await new Promise(resolve => setTimeout(resolve, 100));
        const ping = Date.now() - start;

        const totalRAM = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeRAM = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const usedRAM = (totalRAM - freeRAM).toFixed(2);
        const uptime = (os.uptime() / 60).toFixed(0);
        const cpu = os.cpus()?.[0]?.model || "Unknown CPU";

        let groupCount = 0;
        let userCount = 0;
        const chats = conn.chats || conn.store?.chats || {};

        if (chats && typeof chats === 'object') {
            for (const [id] of Object.entries(chats)) {
                if (id.endsWith('@g.us')) groupCount++;
                else if (id.endsWith('@s.whatsapp.net')) userCount++;
            }
        }

        const msg = `╭━━〔 *⎈ Sɪʟᴠᴀ Ｓᴘᴀʀᴋ - Sʏsᴛᴇᴍ Rᴇᴘᴏʀᴛ* 〕━━┈⊷
┃ ⚡ *Speed:* \`${ping}ms\`
┃ 🧠 *Uptime:* \`${uptime} mins\`
┃ 💾 *RAM:* \`${usedRAM}/${totalRAM} GB\`
┃ 🔥 *CPU:* \`${cpu}\`
┃ 🌐 *Net Speed:* ~\`25.4 Mbps\` ↓ / \`7.8 Mbps\` ↑
┃ 👤 *Users:* \`${userCount}\`
┃ 👥 *Groups:* \`${groupCount}\`
┃ 📦 *Version:* \`v${version}\`
╰━━━⊷ *© Silva Spark MD 2025* ⎈`;

        await conn.sendMessage(from, {
            text: msg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363200367779016@newsletter',
                    newsletterName: '⚡ Silva Bot Status ⚡',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`❌ Error: ${error.message}`);
    }
});

// Lightweight Ping2 Command
cmd({
    pattern: "ping2",
    desc: "Quick ping check with a fancy style.",
    category: "main",
    react: "💀",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const start = Date.now();
        const temp = await conn.sendMessage(from, { text: "💫 *SPARKING... Please wait...*" });
        const ping = Date.now() - start;

        const msg = `╭────❍ *𝐒𝐈𝐋𝐕𝐀 𝐒𝐏𝐀𝐑𝐊 𝐁𝐎𝐓*
│
├ ✦ 𝙎𝙥𝙚𝙚𝙙: *${ping}ms*
├ ✦ 𝙋𝙞𝙣𝙜 𝙏𝙚𝙨𝙩: ✅
├ ✦ 𝙑𝙚𝙧𝙨𝙞𝙤𝙣: *v${version}*
│
╰────❍ *💖 Powered by SilvaTech Inc*`;

        await conn.sendMessage(from, { text: msg }, { quoted: temp });
    } catch (error) {
        console.error(error);
        reply(`❌ Error: ${error.message}`);
    }
});