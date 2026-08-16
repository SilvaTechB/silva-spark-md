const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const axios = require('axios');
const pkg = require('../package.json'); // Get version from package.json

// Visual Elements
const rainbow = ['💥', '💥'];
const emojis = ['✨', '⚡', '🌟', '💫', '🎀', '🧿', '💠', '🔮', '🌈'];

const randomEmoji = () => emojis.sort(() => 0.5 - Math.random()).slice(0, 3).join('');
const divider = (length = 20, char = '─') => char.repeat(length);

// 🔁 Animated Video + Audio Sender
async function sendMenu(conn, from, mek, sender, text, title, sendAudio = false) {
  try {
    await conn.sendMessage(from, {
      video: { url: 'https://videotourl.com/videos/1786863239200-975a4fbc-fd1f-4639-84fa-a513e6c7e0e6.mp4' },
      caption: text,
      gifPlayback: true,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363200367779016@newsletter',
          newsletterName: 'SILVA SPARK MD 💖🦄',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    if (sendAudio) {
      await conn.sendMessage(from, {
        audio: { url: 'https://files.catbox.moe/a1sh4u.mp3' },
        mimetype: 'audio/mp4',
        ptt: true
      }, { quoted: mek });
    }
  } catch (e) {
    console.error(`Menu Error (${title}):`, e);
    throw e;
  }
}

// Main Menu
cmd({
  pattern: "menu",
  desc: "Display all bot commands",
  category: "menu",
  react: "💖",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const menuText = `
╭━━━━━━━━━━━━━━━━━━━━╮
  ✨ SILVA SPARK MD ✨
╰━━━━━━━━━━━━━━━━━━━━╯

${rainbow.join('')} BOT INFORMATION ${rainbow.reverse().join('')}
👑 Owner » ${config.OWNER_NAME}
📱 Version » ${pkg.version}
⚙️ Mode » ${config.MODE.toUpperCase()}
🔣 Prefix » [${config.PREFIX}]
⏳ Runtime » ${runtime(process.uptime())}
${divider(30)}

${rainbow.join('')} COMMAND CATEGORIES ${rainbow.reverse().join('')}
${randomEmoji()} » ${config.PREFIX}aimenu (AI Tools)
${randomEmoji()} » ${config.PREFIX}animemenu (Anime)
${randomEmoji()} » ${config.PREFIX}convertmenu (Converters)
${randomEmoji()} » ${config.PREFIX}funmenu (Fun)
${randomEmoji()} » ${config.PREFIX}dlmenu (Downloads)
${randomEmoji()} » ${config.PREFIX}groupmenu (Group)
${randomEmoji()} » ${config.PREFIX}ownermenu (Owner)
${randomEmoji()} » ${config.PREFIX}othermenu (Utilities)
${divider(30)}

💡 Type ${config.PREFIX}<command> to use
${config.DESCRIPTION}
    `;

    await sendMenu(conn, from, mek, m.sender, menuText, 'Main Menu', true);
  } catch (e) {
    reply(`❌ Error: ${e.message}`);
  }
});

// AI Menu
cmd({
  pattern: "aimenu",
  desc: "AI commands menu",
  category: "menu",
  react: "🤖",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const aiMenu = `
╭━━━━━━━━━━━━━━━━━━━━╮
  🧠 AI POWER MENU 🧠
╰━━━━━━━━━━━━━━━━━━━━╯

${rainbow.join('')} AI CHATBOTS ${rainbow.reverse().join('')}
• ai » General AI assistant
• gpt » ChatGPT interaction
• gpt4 » GPT-4 model
• meta » Meta AI
• bing » Microsoft Bing AI
• copilot » GitHub Copilot
• blackbox » Code specialist

${rainbow.join('')} TOOLS ${rainbow.reverse().join('')}
• tts » Text to speech
• trt » Translate text
• fancy » Fancy text generator

${divider(30)}
💡 Example: ${config.PREFIX}gpt How does AI work?
    `;

    await sendMenu(conn, from, mek, m.sender, aiMenu, 'AI Menu');
  } catch (e) {
    reply(`❌ Error: ${e.message}`);
  }
});

// Anime Menu
cmd({
  pattern: "animemenu",
  desc: "Anime commands menu",
  category: "menu",
  react: "🧚",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const animeMenu = `
╭━━━━━━━━━━━━━━━━━━━━╮
  🎌 ANIME WORLD 🎌
╰━━━━━━━━━━━━━━━━━━━━╯

${rainbow.join('')} CHARACTERS ${rainbow.reverse().join('')}
• waifu » Random waifu
• neko » Cute neko girl
• maid » Anime maid
• loli » Loli character
• foxgirl » Fox girl
• naruto » Naruto character

${rainbow.join('')} CONTENT ${rainbow.reverse().join('')}
• animenews » Latest news
• animegirl » Random girl
• anime1-5 » Different styles
• fack » Anime facts
• dog » Anime dogs

${rainbow.join('')} REACTIONS ${rainbow.reverse().join('')}
• hug » Anime hug gif
• kiss » Anime kiss gif
• poke » Anime poke gif

${divider(30)}
🎀 Enjoy anime content!
    `;

    await sendMenu(conn, from, mek, m.sender, animeMenu, 'Anime Menu');
  } catch (e) {
    reply(`❌ Error: ${e.message}`);
  }
});

// Download Menu
cmd({
  pattern: "dlmenu",
  desc: "Download commands menu",
  category: "menu",
  react: "💚",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const dlMenu = `
╭━━━━━━━━━━━━━━━━━━━━╮
  📥 DOWNLOAD CENTER 📥
╰━━━━━━━━━━━━━━━━━━━━╯

${rainbow.join('')} SOCIAL MEDIA ${rainbow.reverse().join('')}
• facebook » FB video
• tiktok » TikTok video
• twitter » X/Twitter video
• insta » Instagram media

${rainbow.join('')} MUSIC/VIDEO ${rainbow.reverse().join('')}
• play » YT audio
• ytmp3 » YT to MP3
• ytmp4 » YT to MP4
• spotify » Track download
• audio » Audio extractor
• video » Video downloader

${rainbow.join('')} FILES ${rainbow.reverse().join('')}
• mediafire » MediaFire
• apk » APK files
• git » GitHub repos
• gdrive » Google Drive

${divider(30)}
🔍 Usage: ${config.PREFIX}command <url>
    `;

    await sendMenu(conn, from, mek, m.sender, dlMenu, 'Download Menu');
  } catch (e) {
    reply(`❌ Error: ${e.message}`);
  }
});

// Group Menu
cmd({
  pattern: "groupmenu",
  desc: "Group commands menu",
  category: "menu",
  react: "🥰",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const groupMenu = `
╭━━━━━━━━━━━━━━━━━━━━╮
  🧑‍🤝‍🧑 GROUP MANAGER 🧑‍🤝‍🧑
╰━━━━━━━━━━━━━━━━━━━━╯

${rainbow.join('')} ADMIN TOOLS ${rainbow.reverse().join('')}
• add » Add members
• kick » Remove member
• promote » Make admin
• demote » Remove admin
• grouplink » Get invite
• revoke » Reset link

${rainbow.join('')} SETTINGS ${rainbow.reverse().join('')}
• setwelcome » Welcome msg
• setgoodbye » Goodbye msg
• updategname » Change name
• updategdesc » Change desc
• lockgc » Lock group
• unlockgc » Unlock group

${rainbow.join('')} UTILITIES ${rainbow.reverse().join('')}
• tagall » Mention all
• hidetag » Hidden mention
• getpic » Get group icon
• ginfo » Group info

${divider(30)}
⚠️ Admin privileges required
    `;

    await sendMenu(conn, from, mek, m.sender, groupMenu, 'Group Menu');
  } catch (e) {
    reply(`❌ Error: ${e.message}`);
  }
});

// Fun Menu
cmd({
  pattern: "funmenu",
  desc: "Fun commands menu",
  category: "menu",
  react: "😎",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const funMenu = `
╭━━━━━━━━━━━━━━━━━━━━╮
  🎉 FUN & GAMES 🎉
╰━━━━━━━━━━━━━━━━━━━━╯

${rainbow.join('')} INTERACTIVE ${rainbow.reverse().join('')}
• ship » Ship two users
• character » Create avatar
• hack » Fake hack
• joke » Random joke
• insult » Funny roast
• pickup » Pickup lines

${rainbow.join('')} REACTIONS ${rainbow.reverse().join('')}
• hug » Send hug
• kiss » Send kiss
• poke » Poke someone
• slap » Slap someone
• pat » Head pats

${rainbow.join('')} EXPRESSIONS ${rainbow.reverse().join('')}
• hrt » Heart eyes
• hpy » Happy face
• anger » Angry face
• shy » Shy reaction

${divider(30)}
🎲 Try them all for fun!
    `;

    await sendMenu(conn, from, mek, m.sender, funMenu, 'Fun Menu');
  } catch (e) {
    reply(`❌ Error: ${e.message}`);
  }
});

// Owner Menu
cmd({
  pattern: "ownermenu",
  desc: "Owner commands menu",
  category: "menu",
  react: "🔰",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const ownerMenu = `
╭━━━━━━━━━━━━━━━━━━━━╮
  👑 OWNER COMMANDS 👑
╰━━━━━━━━━━━━━━━━━━━━╯

${rainbow.join('')} BOT CONTROL ${rainbow.reverse().join('')}
• restart » Restart bot
• shutdown » Stop bot
• updatecmd » Update
• block » Block user
• unblock » Unblock

${rainbow.join('')} PROFILE ${rainbow.reverse().join('')}
• setpp » Set profile pic
• fullpp » Full profile
• menu » Show menu
• menu2 » Alternative menu

${rainbow.join('')} DEBUGGING ${rainbow.reverse().join('')}
• gjid » Get group JID
• jid » Get user JID
• listcmd » All commands
• allmenu » Complete menu

${divider(30)}
🔒 Restricted to owner only
    `;

    await sendMenu(conn, from, mek, m.sender, ownerMenu, 'Owner Menu');
  } catch (e) {
    reply(`❌ Error: ${e.message}`);
  }
});

// Convert Menu
cmd({
  pattern: "convertmenu",
  desc: "Conversion commands menu",
  category: "menu",
  react: "🥀",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const convertMenu = `
╭━━━━━━━━━━━━━━━━━━━━╮
  🔄 CONVERTER TOOLS 🔄
╰━━━━━━━━━━━━━━━━━━━━╯

${rainbow.join('')} MEDIA CONVERSION ${rainbow.reverse().join('')}
• sticker » Image to sticker
• sticker2 » Video to sticker
• tomp3 » Media to audio
• take » Take sticker

${rainbow.join('')} TEXT TOOLS ${rainbow.reverse().join('')}
• tts » Text to speech
• trt » Translate text
• fancy » Stylish text
• font » Different fonts

${rainbow.join('')} OTHER ${rainbow.reverse().join('')}
• img » Image editor
• vv » View once tools

${divider(30)}
🛠️ Powerful conversion tools
    `;

    await sendMenu(conn, from, mek, m.sender, convertMenu, 'Convert Menu');
  } catch (e) {
    reply(`❌ Error: ${e.message}`);
  }
});

// Other Menu
cmd({
  pattern: "othermenu",
  desc: "Utility commands menu",
  category: "menu",
  react: "🤖",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const otherMenu = `
╭━━━━━━━━━━━━━━━━━━━━╮
  🛠️ UTILITY TOOLS 🛠️
╰━━━━━━━━━━━━━━━━━━━━╯

${rainbow.join('')} INFORMATION ${rainbow.reverse().join('')}
• weather » Weather report
• news » Latest news
• movie » Movie info
• define » Dictionary
• wikipedia » Wiki search
• fact » Interesting facts

${rainbow.join('')} SOCIAL ${rainbow.reverse().join('')}
• githubstalk » GitHub info
• pair » Match users
• pair2 » Alternative match
• vv » View once tools

${rainbow.join('')} DEVELOPER ${rainbow.reverse().join('')}
• srepo » Search repos
• gpass » Generate password
• yts » YT search
• ytv » YT video search

${divider(30)}
🔧 Useful everyday tools
    `;

    await sendMenu(conn, from, mek, m.sender, otherMenu, 'Utility Menu');
  } catch (e) {
    reply(`❌ Error: ${e.message}`);
  }
});
