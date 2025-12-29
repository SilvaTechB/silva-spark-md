const axios = require('axios');
const { cmd } = require('../command');
const fs = require('fs');
const os = require('os');

// Load version from package.json
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = pkg.version || "1.0.0";

// Format uptime
function formatUptime(ms) {
    const sec = Math.floor((ms / 1000) % 60);
    const min = Math.floor((ms / (1000 * 60)) % 60);
    const hr = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hr}h ${min}m ${sec}s`;
}

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "📦 Show full repo & runtime stats",
    category: "main",
    react: "🧑‍💻",
    filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        const repoUrl = 'https://api.github.com/repos/SilvaTechB/silva-md-bot';
        const { data } = await axios.get(repoUrl, { timeout: 8000 }); // timeout added

        const { stargazers_count, forks_count } = data;
        const estUsers = (stargazers_count + forks_count) * 5;

        const uptime = formatUptime(process.uptime() * 1000);
        const platform = os.platform().toUpperCase();
        const arch = os.arch().toUpperCase();

        // Optional: Count command files directly
        const commandFiles = fs.readdirSync('./plugins').filter(file => file.endsWith('.js')).length;

        const msg = `
╭━━〔 *⎈ Silva Spark MD Runtime Info* 〕━━⊷
┃
┃ 🧠 *Project:* Silva Spark MD
┃ 🔗 *Repo:* https://github.com/SilvaTechB/silva-spark-md
┃ ⭐ Stars: ${stargazers_count}
┃ 🍴 Forks: ${forks_count}
┃ 👥 Estimated Users: ${estUsers}
┃ 🛠 Version: v${version}
┃ 💡 Commands Loaded: ${commandFiles}
┃ 🕒 Uptime: ${uptime}
┃ 💻 System: ${platform} (${arch})
┃
╰━━━⊷ *© SilvaTech Inc 2025*`.trim();

        const contextInfo = {
            forwardingScore: 999,
            isForwarded: true,
            mentionedJid: [m.sender],
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363200367779016@newsletter',
                newsletterName: 'SILVA SPARK MD 💖🦄',
                serverMessageId: 143
            }
        };

        // Send main stats
        await conn.sendMessage(from, { text: msg, contextInfo }, { quoted: mek });

        // Send fancy image
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/0vldgh.jpeg' },
            caption: `✨ *Silva Spark MD: Powering Smart Chats!* ✨\n\n📎 *Repo:* github.com/SilvaTechB/silva-md-bot\n⭐ Stars: ${stargazers_count}\n🍴 Forks: ${forks_count}\n👥 Users: ${estUsers}`,
            contextInfo
        }, { quoted: mek });

        // Send promo audio
        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/hpwsi2.mp3' },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

    } catch (err) {
        console.error("❌ Repo Error:", err.message);
        reply(`🚫 *Oops!* Couldn’t fetch repo info.\n💬 ${err.message || "Network/Timeout Error"}`);
    }
});