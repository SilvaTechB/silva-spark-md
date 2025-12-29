const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  prepareWAMessageMedia,
  downloadContentFromMessage,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys')

const l = console.log
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const fs = require('fs')
const P = require('pino')
const config = require('./config')
const { sms, downloadMediaMessage } = require('./lib/msg')
const FileType = require('file-type');
const axios = require('axios')
const { fromBuffer } = require('file-type')
const os = require('os')
const path = require('path')
const zlib = require('zlib')
const prefix = config.PREFIX

const ownerNumber = ['254700143167']

// ✅ Global Context Info
const globalContextInfo = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363200367779016@newsletter',
    newsletterName: '◢◤ Silva Tech Nexus ◢◤',
    serverMessageId: 144
  }
};

const tempDir = path.join(os.tmpdir(), 'cache-temp')
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir)
}

const clearTempDir = () => {
    fs.readdir(tempDir, (err, files) => {
        if (err) return;
        for (const file of files) {
            fs.unlink(path.join(tempDir, file), err => {});
        }
    });
}

setInterval(clearTempDir, 5 * 60 * 1000);

// Store for deleted messages
const deletedMessages = new Map();

// ============================== 
// 🔐 SESSION MANAGEMENT 
// ============================== 
async function loadSession() {
  try {
      const credsPath = './sessions/creds.json';
      
      if (!fs.existsSync('./sessions')) {
          fs.mkdirSync('./sessions', { recursive: true });
      }
      
      if (!config.SESSION_ID || typeof config.SESSION_ID !== 'string') {
          console.log('⚠️ SESSION_ID missing, using QR');
          return false;
      }
      
      const [header, b64data] = config.SESSION_ID.split('~');
      if (header !== "Silva" || !b64data) {
          console.log('❌ Invalid session format');
          return false;
      }
      
      const cleanB64 = b64data.replace(/\.\.\./g, '');
      const compressedData = Buffer.from(cleanB64, 'base64');
      const decompressedData = zlib.gunzipSync(compressedData);
      fs.writeFileSync(credsPath, decompressedData, "utf8");
      console.log('✅ Session loaded successfully');
      return true;
  } catch (e) {
      console.log('❌ Session Error: ' + e.message);
      return false;
  }
}

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;

//=============================================

async function connectToWA() {
console.log("Connecting silva spark to WhatsApp ⏳️...");

// Load session before connecting
await loadSession();

const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/')
var { version } = await fetchLatestBaileysVersion()

const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version
        })
    
conn.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect } = update

if (connection === 'close') {
  const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
  console.log('Connection closed. Reconnecting:', shouldReconnect)
  if (shouldReconnect) {
    connectToWA()
  }
} else if (connection === 'open') {
  console.log('🧬 Installing silva spark Plugins')
  const pluginPath = require('path');
  try {
    fs.readdirSync("./plugins/").forEach((plugin) => {
      if (pluginPath.extname(plugin).toLowerCase() == ".js") {
        require("./plugins/" + plugin);
      }
    });
    console.log('Plugins installed successful ✅')
  } catch (e) {
    console.log('Plugin loading error:', e.message)
  }
  
  console.log('Bot connected to whatsapp ✅')
  
  // Send welcome message
  try {
    const botJid = conn.user.id;
    console.log('Bot JID:', botJid);
    
    let up = `*Hello there ✦ Silva ✦ Spark ✦ MD ✦ User! 👋🏻* \n\n> This is a user friendly whatsapp bot created by Silva Tech Inc 🎊, Meet ✦ Silva ✦ Spark ✦ MD ✦ WhatsApp Bot.\n\n *Thanks for using ✦ Silva ✦ Spark ✦ MD ✦ 🚩* \n\n> follow WhatsApp Channel :- 💖\n \nhttps://whatsapp.com/channel/0029VaAkETLLY6d8qhLmZt2v\n\n- *YOUR PREFIX:* = ${prefix}\n\nDont forget to give star to repo ⬇️\n\nhttps://github.com/SilvaTechB/silva-spark-md\n\n> © Powered BY ✦ Silva ✦ Spark ✦ MD ✦ 🖤`;
    
    await conn.sendMessage(botJid, { 
      text: up,
      contextInfo: globalContextInfo 
    });
    console.log('✅ Welcome message sent successfully');
  } catch (error) {
    console.log('❌ Failed to send welcome message:', error.message);
  }
}
})

conn.ev.on('creds.update', saveCreds)  
    
//=============MESSAGE HANDLER=======
      
conn.ev.on('messages.upsert', async(msg) => {
  try {
    const mek = msg.messages[0]
    if (!mek.message) return
    
    console.log('📨 New message from:', mek.key.remoteJid);
    
    // Store message for antidelete
    if (mek.key && mek.key.remoteJid !== 'status@broadcast') {
      deletedMessages.set(mek.key.id, {
        message: mek,
        chat: mek.key.remoteJid,
        sender: mek.key.participant || mek.key.remoteJid,
        timestamp: Date.now()
      });
      
      setTimeout(() => {
        deletedMessages.delete(mek.key.id);
      }, 2 * 60 * 60 * 1000);
    }
    
    mek.message = (getContentType(mek.message) === 'ephemeralMessage') 
    ? mek.message.ephemeralMessage.message 
    : mek.message;
    
  if (config.READ_MESSAGE === 'true') {
    await conn.readMessages([mek.key]);
  }
  
    if(mek.message.viewOnceMessageV2) {
      mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
    }
    
    if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN === "true"){
      await conn.readMessages([mek.key])
    }
    
     if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REACT === "true"){
    const jawadlike = await conn.decodeJid(conn.user.id);
    const emojis = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    await conn.sendMessage(mek.key.remoteJid, {
      react: {
        text: randomEmoji,
        key: mek.key,
      } 
    }, { statusJidList: [mek.key.participant, jawadlike] });
  }
  
  if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REPLY === "true"){
    const user = mek.key.participant
    const text = `${config.AUTO_STATUS__MSG}`
    await conn.sendMessage(user, { text: text, react: { text: '✈️', key: mek.key } }, { quoted: mek })
  }
  
    let jawadik = mek.message.viewOnceMessageV2
    if (jawadik && config.ANTI_VV === "true") {
      const botNum = conn.user.id.split(':')[0] + '@s.whatsapp.net';
      if (jawadik.message.imageMessage) {
        let cap = jawadik.message.imageMessage.caption;
        let anu = await conn.downloadAndSaveMediaMessage(jawadik.message.imageMessage);
        return conn.sendMessage(botNum, { image: { url: anu }, caption: cap }, { quoted: mek });
      }
      if (jawadik.message.videoMessage) {
        let cap = jawadik.message.videoMessage.caption;
        let anu = await conn.downloadAndSaveMediaMessage(jawadik.message.videoMessage);
        return conn.sendMessage(botNum, { video: { url: anu }, caption: cap }, { quoted: mek });
      }
      if (jawadik.message.audioMessage) {
        let anu = await conn.downloadAndSaveMediaMessage(jawadik.message.audioMessage);
        return conn.sendMessage(botNum, { audio: { url: anu } }, { quoted: mek });
      }
    }
    
  const m = sms(conn, mek)
  const type = getContentType(mek.message)
  const content = JSON.stringify(mek.message)
  const from = mek.key.remoteJid
  const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
  const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
  const isCmd = body.startsWith(prefix)
  const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
  const args = body.trim().split(/ +/).slice(1)
  const q = args.join(' ')
  const isGroup = from.endsWith('@g.us')
  const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
  const senderNumber = sender.split('@')[0]
  const botNumber = conn.user.id.split(':')[0]
  const pushname = mek.pushName || 'Sin Nombre'
  const isMe = botNumber.includes(senderNumber)
  const isOwner = ownerNumber.includes(senderNumber) || isMe
  const botNumber2 = await jidNormalizedUser(conn.user.id);
  const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
  const groupName = isGroup ? groupMetadata.subject : ''
  const participants = isGroup ? await groupMetadata.participants : ''
  const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
  const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
  const isAdmins = isGroup ? groupAdmins.includes(sender) : false
  const isReact = m.message.reactionMessage ? true : false
  
  const reply = (teks) => {
    conn.sendMessage(from, { text: teks, contextInfo: globalContextInfo }, { quoted: mek })
  }
  
  console.log('📝 Message body:', body);
  console.log('🔍 isCmd:', isCmd, 'command:', command);
  
  //===================================================   
  conn.decodeJid = jid => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user &&
          decode.server &&
          decode.user + '@' + decode.server) ||
        jid
      );
    } else return jid;
  };
  
  //===================================================
  conn.downloadAndSaveMediaMessage = async(message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(quoted, messageType)
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
    let type = await FileType.fromBuffer(buffer)
    trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
    await fs.writeFileSync(trueFileName, buffer)
    return trueFileName
  }
  
  //===================================================
  conn.sendText = (jid, text, quoted = '', options) => conn.sendMessage(jid, { text: text, contextInfo: globalContextInfo, ...options }, { quoted })
  
  //================ownerreact==============
  
  if(senderNumber.includes("254700143167")){
    if(!isReact) m.react("🦄")
  }
  
  //==========public react============//
  if (!isReact && senderNumber !== botNumber) {
      if (config.AUTO_REACT === 'true') {
          const reactions = ['😊', '👍', '😂', '💯', '🔥', '🙏', '🎉', '👏', '😎', '🤖'];
          const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
          m.react(randomReaction);
      }
  }
  
  // Owner React
  if (!isReact && senderNumber === botNumber) {
      if (config.OWNER_REACT === 'true') {
          const reactions = ['😊', '👍', '😂', '💯', '🔥'];
          const randomOwnerReaction = reactions[Math.floor(Math.random() * reactions.length)];
          m.react(randomOwnerReaction);
      }
  }
 
  // Custom react settings        
  if (!isReact && senderNumber !== botNumber) {
    if (config.CUSTOM_REACT === 'true') {
        const reactions = (config.CUSTOM_REACT_EMOJIS || '🥲,😂,👍🏻,🙂,😔').split(',');
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
        m.react(randomReaction);
    }
  }

  if (!isReact && senderNumber === botNumber) {
    if (config.CUSTOM_REACT === 'true') {
        const reactions = (config.CUSTOM_REACT_EMOJIS || '🥲,😂,👍🏻,🙂,😔').split(',');
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
        m.react(randomReaction);
    }
  }
  
  //==========WORKTYPE============ 
  if(!isOwner && config.MODE === "private") return
  if(!isOwner && isGroup && config.MODE === "inbox") return
  if(!isOwner && !isGroup && config.MODE === "groups") return
   
  // take commands 
  try {
    const events = require('./command')
    const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
    
    if (isCmd) {
      console.log('⚡ Processing command:', cmdName);
      const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
      
      if (cmd) {
        console.log('✅ Command found:', cmd.pattern);
        if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }})
        
        try {
          cmd.function(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply});
        } catch (e) {
          console.error("[PLUGIN ERROR] " + e);
          reply('❌ Error executing command: ' + e.message);
        }
      } else {
        console.log('❌ Command not found:', cmdName);
      }
    }
    
    events.commands.map(async(command) => {
      if (body && command.on === "body") {
        command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
      } else if (mek.q && command.on === "text") {
        command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
      } else if (
        (command.on === "image" || command.on === "photo") &&
        mek.type === "imageMessage"
      ) {
        command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
      } else if (
        command.on === "sticker" &&
        mek.type === "stickerMessage"
      ) {
        command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
      }
    });
  } catch (e) {
    console.error("[COMMAND HANDLER ERROR] " + e);
  }
  
  } catch (e) {
    console.error("[MESSAGE UPSERT ERROR] ", e);
  }
})

// ============================== 
// 🛡️ ANTI-DELETE HANDLER 
// ============================== 
conn.ev.on('messages.update', async (updates) => {
  try {
    for (const update of updates) {
      if (update.update.message === null && update.key) {
        const deletedMsg = deletedMessages.get(update.key.id);
        
        if (update.key.remoteJid === 'status@broadcast') continue;
        
        if (deletedMsg && config.ANTI_DELETE === 'true') {
          try {
            const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
            
            const chatName = deletedMsg.chat.endsWith('@g.us') 
              ? (await conn.groupMetadata(deletedMsg.chat).catch(() => null))?.subject || 'Unknown Group'
              : deletedMsg.sender.split('@')[0];
            
            const senderName = deletedMsg.message.pushName || deletedMsg.sender.split('@')[0];
            const deleterJid = update.key.participant || update.key.remoteJid;
            const deleterName = deleterJid.split('@')[0];
            
            let caption = `🚫 *Anti-Delete Alert* 🚫\n\n`;
            caption += `👤 *Sender:* ${senderName}\n`;
            caption += `🗑️ *Deleted By:* ${deleterName}\n`;
            caption += `📍 *Location:* ${chatName}\n`;
            caption += `📱 *Chat:* ${deletedMsg.chat.endsWith('@g.us') ? 'Group' : 'Private'}\n`;
            caption += `⏰ *Time:* ${new Date().toLocaleString()}\n\n`;
            caption += `💬 *Message Below* 👇`;
            
            await conn.sendMessage(botNumber, {
              text: caption,
              contextInfo: globalContextInfo
            });
            
            await conn.copyNForward(botNumber, deletedMsg.message, true);
            
            console.log(`✅ Anti-delete: Forwarded deleted message from ${senderName}`);
          } catch (error) {
            console.error('❌ Anti-delete error:', error);
          }
        }
      }
    }
  } catch (e) {
    console.error('[ANTI-DELETE ERROR]', e);
  }
});

//===================================================
conn.copyNForward = async(jid, message, forceForward = false, options = {}) => {
  let vtype
  if (options.readViewOnce) {
      message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
      vtype = Object.keys(message.message.viewOnceMessage.message)[0]
      delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
      delete message.message.viewOnceMessage.message[vtype].viewOnce
      message.message = {
          ...message.message.viewOnceMessage.message
      }
  }

  let mtype = Object.keys(message.message)[0]
  let content = await generateForwardMessageContent(message, forceForward)
  let ctype = Object.keys(content)[0]
  let context = {}
  if (mtype != "conversation") context = message.message[mtype].contextInfo
  content[ctype].contextInfo = {
      ...context,
      ...content[ctype].contextInfo
  }
  const waMessage = await generateWAMessageFromContent(jid, content, options ? {
      ...content[ctype],
      ...options,
      ...(options.contextInfo ? {
          contextInfo: {
              ...content[ctype].contextInfo,
              ...options.contextInfo
          }
      } : {})
  } : {})
  await conn.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
  return waMessage
}

}

app.get("/", (req, res) => {
res.send("silva spark RUNNING ✅");
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

setTimeout(() => {
connectToWA()
}, 4000);
