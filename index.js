const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  AnyMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  downloadContentFromMessage,
  MessageRetryMap,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID, 
  makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers,
  makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys')

const l = console.log
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const fs = require('fs')
const ff = require('fluent-ffmpeg')
const P = require('pino')
const config = require('./config')
const qrcode = require('qrcode-terminal')
const StickersTypes = require('wa-sticker-formatter')
const util = require('util')
const { sms, downloadMediaMessage } = require('./lib/msg')
const FileType = require('file-type');
const axios = require('axios')
const { fromBuffer } = require('file-type')
const bodyparser = require('body-parser')
const os = require('os')
const Crypto = require('crypto')
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
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(tempDir, file), err => {
                if (err) throw err;
            });
        }
    });
}

// Clear the temp directory every 5 minutes
setInterval(clearTempDir, 5 * 60 * 1000);

// ==============================
// 🔐 SESSION MANAGEMENT
// ==============================
const botLogger = {
    log: (type, message) => {
        const timestamp = new Date().toLocaleString();
        console.log(`[${timestamp}] [${type}] ${message}`);
    }
};

async function loadSession() {
    try {
        const credsPath = './sessions/creds.json';
        
        if (!fs.existsSync('./sessions')) {
            fs.mkdirSync('./sessions', { recursive: true });
        }
        
        // Clean old sessions if needed
        if (fs.existsSync(credsPath)) {
            try {
                // Check if session is valid before deleting
                const credsData = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
                if (!credsData || !credsData.me) {
                    fs.unlinkSync(credsPath);
                    botLogger.log('INFO', "♻️ Invalid session removed");
                }
            } catch (e) {
                // If can't parse, remove it
                try {
                    fs.unlinkSync(credsPath);
                    botLogger.log('INFO', "♻️ Corrupted session removed");
                } catch (err) {
                    // Ignore error
                }
            }
        }
        
        if (!config.SESSION_ID || typeof config.SESSION_ID !== 'string') {
            botLogger.log('WARNING', "SESSION_ID missing, using QR");
            return false;
        }
        
        const [header, b64data] = config.SESSION_ID.split('~');
        if (header !== "Silva" || !b64data) {
            botLogger.log('ERROR', "Invalid session format");
            return false;
        }
        
        const cleanB64 = b64data.replace(/\.\.\./g, '');
        const compressedData = Buffer.from(cleanB64, 'base64');
        const decompressedData = zlib.gunzipSync(compressedData);
        fs.writeFileSync(credsPath, decompressedData, "utf8");
        botLogger.log('SUCCESS', "✅ Session loaded successfully");
        return true;
    } catch (e) {
        botLogger.log('ERROR', "Session Error: " + e.message);
        return false;
    }
}

const express = require("express");
const app = express();
const port = process.env.PORT || 9090;

// ==============================
// 📦 MESSAGE STORE FOR ANTI-DELETE
// ==============================
const messageStore = new Map();

//=============================================

async function connectToWA() {
    console.log("Connecting silva spark to WhatsApp ⏳️...");
    
    // Load session before connecting
    await loadSession();
    
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/')
    var { version } = await fetchLatestBaileysVersion()

    // FIXED: Use correct browser configuration with Baileys.Browsers
    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        browser: Browsers.macOS('Desktop'),
        syncFullHistory: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' }))
        },
        version,
        getMessage: async (key) => {
            if (messageStore.has(key.id)) {
                return messageStore.get(key.id).message
            }
            return {
                conversation: ''
            }
        }
    })
    
    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update
        
        if (qr) {
            console.log('QR Code received, scan with WhatsApp:')
            qrcode.generate(qr, { small: true })
        }
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('Connection closed due to:', lastDisconnect?.error, ', reconnecting:', shouldReconnect)
            
            if (shouldReconnect) {
                connectToWA()
            } else {
                console.log('Logged out. Please delete sessions folder and restart.')
            }
        } else if (connection === 'open') {
            console.log('🧬 Installing silva spark Plugins')
            const path = require('path');
            fs.readdirSync("./plugins/").forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() == ".js") {
                    require("./plugins/" + plugin);
                }
            });
            console.log('Plugins installed successful ✅')
            console.log('Bot connected to whatsapp ✅')
            
            let up = `*Hello there ✦ Silva ✦ Spark ✦ MD ✦ User! 👋🏻* \n\n> This is a user friendly whatsapp bot created by Silva Tech Inc 🎊, Meet ✦ Silva ✦ Spark ✦ MD ✦ WhatsApp Bot.\n\n *Thanks for using ✦ Silva ✦ Spark ✦ MD ✦ 🚩* \n\n> follow WhatsApp Channel :- 💖\n \nhttps://whatsapp.com/channel/0029VaAkETLLY6d8qhLmZt2v\n\n- *YOUR PREFIX:* = ${prefix}\n\nDont forget to give star to repo ⬇️\n\nhttps://github.com/SilvaTechB/silva-spark-md\n\n> © Powered BY ✦ Silva ✦ Spark ✦ MD ✦ 🖤`;
            conn.sendMessage(conn.user.id, { 
                video: { url: `https://files.catbox.moe/2xxr9h.mp4` }, 
                caption: up,
                contextInfo: globalContextInfo 
            })
        }
    })
    
    conn.ev.on('creds.update', saveCreds)
    
    // ==============================
    // 📥 STORE MESSAGES FOR ANTI-DELETE
    // ==============================
    conn.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;
        
        // ⚠️ IGNORE status@broadcast messages in anti-delete
        if (msg.key.remoteJid === 'status@broadcast') {
            return;
        }
        
        // Store message for anti-delete
        const messageKey = `${msg.key.remoteJid}_${msg.key.id}`;
        messageStore.set(messageKey, {
            message: msg,
            sender: msg.key.participant || msg.key.remoteJid,
            chat: msg.key.remoteJid,
            timestamp: Date.now()
        });
        
        // Store for getMessage
        messageStore.set(msg.key.id, msg);
        
        // Clean old messages (older than 24 hours)
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        for (const [key, value] of messageStore.entries()) {
            if (value.timestamp && value.timestamp < oneDayAgo) {
                messageStore.delete(key);
            }
        }
    });
    
    // ==============================
    // 🗑️ ANTI-DELETE HANDLER (MODIFIED)
    // ==============================
    conn.ev.on('messages.update', async (updates) => {
        for (const update of updates) {
            try {
                if (update.update.message === null) {
                    // Message was deleted
                    const messageKey = `${update.key.remoteJid}_${update.key.id}`;
                    const storedMessage = messageStore.get(messageKey);
                    
                    // ⚠️ IGNORE status@broadcast messages in anti-delete
                    if (update.key.remoteJid === 'status@broadcast') {
                        continue;
                    }
                    
                    if (storedMessage && config.ANTI_DELETE === "true") {
                        const ownerJid = ownerNumber[0] + '@s.whatsapp.net';
                        const isGroup = storedMessage.chat.endsWith('@g.us');
                        
                        // Validate JIDs before sending
                        if (!update.key.remoteJid || !storedMessage.sender) {
                            console.log('Invalid JID in anti-delete, skipping...');
                            continue;
                        }
                        
                        let deletedBy = update.key.participant || storedMessage.sender;
                        let chatName = storedMessage.chat;
                        
                        if (isGroup) {
                            try {
                                const groupMetadata = await conn.groupMetadata(storedMessage.chat);
                                chatName = groupMetadata.subject;
                            } catch (e) {
                                chatName = storedMessage.chat;
                            }
                        }
                        
                        const senderName = storedMessage.message.pushName || deletedBy.split('@')[0];
                        const deletedByName = deletedBy.split('@')[0];
                        
                        let notificationText = `🗑️ *ANTI-DELETE ALERT*\n\n`;
                        notificationText += `📍 *Location:* ${isGroup ? 'Group' : 'Private Chat'}\n`;
                        notificationText += `💬 *Chat:* ${chatName}\n`;
                        notificationText += `👤 *Sent By:* @${senderName.replace('@', '')}\n`;
                        notificationText += `🗑️ *Deleted By:* @${deletedByName}\n`;
                        notificationText += `⏰ *Time:* ${new Date().toLocaleString()}\n`;
                        notificationText += `\n📨 *Forwarding deleted message...*`;
                        
                        // Send notification
                        await conn.sendMessage(ownerJid, { 
                            text: notificationText,
                            mentions: [deletedBy, storedMessage.sender],
                            contextInfo: globalContextInfo
                        });
                        
                        // Forward the deleted message
                        try {
                            await conn.copyNForward(ownerJid, storedMessage.message, false, {
                                contextInfo: globalContextInfo
                            });
                        } catch (e) {
                            await conn.sendMessage(ownerJid, { 
                                text: `❌ Could not forward message content: ${e.message}`,
                                contextInfo: globalContextInfo
                            });
                        }
                        
                        // Clean up
                        messageStore.delete(messageKey);
                    }
                }
            } catch (e) {
                console.log('Anti-delete error:', e.message);
            }
        }
    });
      
    //=============readstatus=======
      
    conn.ev.on('messages.upsert', async (mek) => {
        mek = mek.messages[0]
        if (!mek.message) return
        mek.message = (getContentType(mek.message) === 'ephemeralMessage') 
        ? mek.message.ephemeralMessage.message 
        : mek.message;
        
        if (config.READ_MESSAGE === 'true') {
            await conn.readMessages([mek.key]);
            console.log(`Marked message from ${mek.key.remoteJid} as read.`);
        }
        
        if (mek.message.viewOnceMessageV2)
            mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
        
        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN === "true") {
            await conn.readMessages([mek.key])
        }
        
        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REACT === "true") {
            try {
                const jawadlike = await conn.decodeJid(conn.user.id);
                const emojis = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '💜', '💙', '🌝', '🖤', '💚'];
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                if (mek.key.participant) {
                    await conn.sendMessage(mek.key.remoteJid, {
                        react: {
                            text: randomEmoji,
                            key: mek.key,
                        }
                    }, { statusJidList: [mek.key.participant, jawadlike] });
                }
            } catch (e) {
                console.log('Status react error:', e.message);
            }
        }
        
        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REPLY === "true") {
            try {
                const user = mek.key.participant
                if (user) {
                    const text = `${config.AUTO_STATUS__MSG || 'Nice status!'}`
                    await conn.sendMessage(user, { text: text, react: { text: '✈️', key: mek.key } }, { quoted: mek })
                }
            } catch (e) {
                console.log('Status reply error:', e.message);
            }
        }
        
        let jawadik = mek.message.viewOnceMessageV2
        let jawadik1 = mek.mtype === "viewOnceMessage"
        
        if (jawadik && config.ANTI_VV === "true") {
            try {
                if (jawadik.message.imageMessage) {
                    let cap = jawadik.message.imageMessage.caption || '';
                    let anu = await conn.downloadAndSaveMediaMessage(jawadik.message.imageMessage);
                    return conn.sendMessage("254700143167@s.whatsapp.net", { 
                        image: { url: anu }, 
                        caption: cap,
                        contextInfo: globalContextInfo 
                    }, { quoted: mek });
                } 
                if (jawadik.message.videoMessage) {
                    let cap = jawadik.message.videoMessage.caption || '';
                    let anu = await conn.downloadAndSaveMediaMessage(jawadik.message.videoMessage);
                    return conn.sendMessage("254700143167@s.whatsapp.net", { 
                        video: { url: anu }, 
                        caption: cap,
                        contextInfo: globalContextInfo 
                    }, { quoted: mek });
                } 
                if (jawadik.message.audioMessage) {
                    let anu = await conn.downloadAndSaveMediaMessage(jawadik.message.audioMessage);
                    return conn.sendMessage("254700143167@s.whatsapp.net", { 
                        audio: { url: anu },
                        contextInfo: globalContextInfo 
                    }, { quoted: mek });
                }
            } catch (e) {
                console.log('Anti-VV error:', e.message);
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
        const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
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
        conn.copyNForward = async (jid, message, forceForward = false, options = {}) => {
            let vtype
            if (options.readViewOnce) {
                message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
                vtype = Object.keys(message.message.viewOnceMessage.message)[0]
                delete (message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
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
        
        //=================================================
        conn.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
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
        
        //=================================================
        conn.downloadMediaMessage = async (message) => {
            let mime = (message.msg || message).mimetype || ''
            let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
            const stream = await downloadContentFromMessage(message, messageType)
            let buffer = Buffer.from([])
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }

            return buffer
        }

        //================================================
        conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
            let mime = '';
            let res = await axios.head(url)
            mime = res.headers['content-type']
            if (mime.split("/")[1] === "gif") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, contextInfo: globalContextInfo, ...options }, { quoted: quoted, ...options })
            }
            let type = mime.split("/")[0] + "Message"
            if (mime === "application/pdf") {
                return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, contextInfo: globalContextInfo, ...options }, { quoted: quoted, ...options })
            }
            if (mime.split("/")[0] === "image") {
                return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, contextInfo: globalContextInfo, ...options }, { quoted: quoted, ...options })
            }
            if (mime.split("/")[0] === "video") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', contextInfo: globalContextInfo, ...options }, { quoted: quoted, ...options })
            }
            if (mime.split("/")[0] === "audio") {
                return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', contextInfo: globalContextInfo, ...options }, { quoted: quoted, ...options })
            }
        }
        
        //==========================================================
        conn.cMod = (jid, copy, text = '', sender = conn.user.id, options = {}) => {
            let mtype = Object.keys(copy.message)[0]
            let isEphemeral = mtype === 'ephemeralMessage'
            if (isEphemeral) {
                mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
            }
            let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
            let content = msg[mtype]
            if (typeof content === 'string') msg[mtype] = text || content
            else if (content.caption) content.caption = text || content.caption
            else if (content.text) content.text = text || content.text
            if (typeof content !== 'string') msg[mtype] = {
                ...content,
                ...options
            }
            if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
            else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
            if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
            else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
            copy.key.remoteJid = jid
            copy.key.fromMe = sender === conn.user.id

            return proto.WebMessageInfo.fromObject(copy)
        }

        //=====================================================
        conn.getFile = async (PATH, save) => {
            let res
            let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
            let type = await FileType.fromBuffer(data) || {
                mime: 'application/octet-stream',
                ext: '.bin'
            }
            let filename = path.join(__filename, __dirname + new Date * 1 + '.' + type.ext)
            if (data && save) fs.promises.writeFile(filename, data)
            return {
                res,
                filename,
                size: await getSizeMedia(data),
                ...type,
                data
            }
        }
        
        //=====================================================
        conn.sendFile = async (jid, PATH, fileName, quoted = {}, options = {}) => {
            let types = await conn.getFile(PATH, true)
            let { filename, size, ext, mime, data } = types
            let type = '',
                mimetype = mime,
                pathFile = filename
            if (options.asDocument) type = 'document'
            if (options.asSticker || /webp/.test(mime)) {
                let { writeExif } = require('./exif.js')
                let media = { mimetype: mime, data }
                pathFile = await writeExif(media, { packname: Config.packname, author: Config.packname, categories: options.categories ? options.categories : [] })
                await fs.promises.unlink(filename)
                type = 'sticker'
                mimetype = 'image/webp'
            } else if (/image/.test(mime)) type = 'image'
            else if (/video/.test(mime)) type = 'video'
            else if (/audio/.test(mime)) type = 'audio'
            else type = 'document'
            await conn.sendMessage(jid, {
                [type]: { url: pathFile },
                mimetype,
                fileName,
                contextInfo: globalContextInfo,
                ...options
            }, { quoted, ...options })
            return fs.promises.unlink(pathFile)
        }
        
        //=====================================================
        conn.parseMention = async (text) => {
            return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
        }
        
        //=====================================================
        conn.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
            let types = await conn.getFile(path, true)
            let { mime, ext, res, data, filename } = types
            if (res && res.status !== 200 || file.length <= 65536) {
                try { throw { json: JSON.parse(file.toString()) } } catch (e) { if (e.json) throw e.json }
            }
            let type = '',
                mimetype = mime,
                pathFile = filename
            if (options.asDocument) type = 'document'
            if (options.asSticker || /webp/.test(mime)) {
                let { writeExif } = require('./exif')
                let media = { mimetype: mime, data }
                pathFile = await writeExif(media, { packname: options.packname ? options.packname : Config.packname, author: options.author ? options.author : Config.author, categories: options.categories ? options.categories : [] })
                await fs.promises.unlink(filename)
                type = 'sticker'
                mimetype = 'image/webp'
            } else if (/image/.test(mime)) type = 'image'
            else if (/video/.test(mime)) type = 'video'
            else if (/audio/.test(mime)) type = 'audio'
            else type = 'document'
            await conn.sendMessage(jid, {
                [type]: { url: pathFile },
                caption,
                mimetype,
                fileName,
                contextInfo: globalContextInfo,
                ...options
            }, { quoted, ...options })
            return fs.promises.unlink(pathFile)
        }
        
        //=====================================================
        conn.sendVideoAsSticker = async (jid, buff, options = {}) => {
            let buffer;
            if (options && (options.packname || options.author)) {
                buffer = await writeExifVid(buff, options);
            } else {
                buffer = await videoToWebp(buff);
            }
            await conn.sendMessage(
                jid,
                { sticker: { url: buffer }, contextInfo: globalContextInfo, ...options },
                options
            );
        };
        
        //=====================================================
        conn.sendImageAsSticker = async (jid, buff, options = {}) => {
            let buffer;
            if (options && (options.packname || options.author)) {
                buffer = await writeExifImg(buff, options);
            } else {
                buffer = await imageToWebp(buff);
            }
            await conn.sendMessage(
                jid,
                { sticker: { url: buffer }, contextInfo: globalContextInfo, ...options },
                options
            );
        };
        
        //=====================================================
        conn.sendTextWithMentions = async (jid, text, quoted, options = {}) => conn.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), ...globalContextInfo }, ...options }, { quoted })

        //=====================================================
        conn.sendImage = async (jid, path, caption = '', quoted = '', options) => {
            let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
            return await conn.sendMessage(jid, { image: buffer, caption: caption, contextInfo: globalContextInfo, ...options }, { quoted })
        }

        //=====================================================
        conn.sendText = (jid, text, quoted = '', options) => conn.sendMessage(jid, { text: text, contextInfo: globalContextInfo, ...options }, { quoted })

        //=====================================================
        conn.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
            let buttonMessage = {
                text,
                footer,
                buttons,
                headerType: 2,
                contextInfo: globalContextInfo,
                ...options
            }
            conn.sendMessage(jid, buttonMessage, { quoted, ...options })
        }
        
        //=====================================================
        conn.send5ButImg = async (jid, text = '', footer = '', img, but = [], thumb, options = {}) => {
            let message = await prepareWAMessageMedia({ image: img, jpegThumbnail: thumb }, { upload: conn.waUploadToServer })
            var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
                templateMessage: {
                    hydratedTemplate: {
                        imageMessage: message.imageMessage,
                        "hydratedContentText": text,
                        "hydratedFooterText": footer,
                        "hydratedButtons": but
                    }
                }
            }), options)
            conn.relayMessage(jid, template.message, { messageId: template.key.id })
        }

        //==========public react============//
        // Auto React 
        if (!isReact && senderNumber !== botNumber) {
            if (config.AUTO_REACT === 'true') {
                const reactions = ['😊', '👍', '😂', '💯', '🔥', '🙏', '🎉', '👏', '😎', '🤖'];
                const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
                m.react(randomReaction);
            }
        }

        // Custom React (for non-bot messages)
        if (!isReact && senderNumber !== botNumber) {
            if (config.CUSTOM_REACT === 'true') {
                const reactions = (config.CUSTOM_REACT_EMOJIS || '💝,💖,💗,❤️‍🔥,❤️‍🩹,❤️,🩷,🧡,💛,💚,💙,🩵,💜,🤎,🖤,🤍').split(',');
                const randomReaction = reactions[Math.floor(Math.random() * reactions.length)].trim();
                m.react(randomReaction);
            }
        }

        // Heart React
        if (!isReact && senderNumber !== botNumber) {
            if (config.HEART_REACT === 'true') {
                m.react('❤️');
            }
        }
        
        //==========WORKTYPE============ 
        if (!isOwner && config.MODE === "private") return
        if (!isOwner && isGroup && config.MODE === "inbox") return
        if (!isOwner && !isGroup && config.MODE === "groups") return

        // take commands 
        const events = require('./command')
        const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
        if (isCmd) {
            const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
            if (cmd) {
                if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } })

                try {
                    cmd.function(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
                } catch (e) {
                    console.error("[PLUGIN ERROR] " + e);
                }
            }
        }
        events.commands.map(async (command) => {
            if (body && command.on === "body") {
                command.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
            } else if (mek.q && command.on === "text") {
                command.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
            } else if (
                (command.on === "image" || command.on === "photo") &&
                mek.type === "imageMessage"
            ) {
                command.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
            } else if (
                command.on === "sticker" &&
                mek.type === "stickerMessage"
            ) {
                command.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply })
            }
        });

    })
}

app.get("/", (req, res) => {
    res.send("silva spark RUNNING ✅");
});
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
setTimeout(() => {
    connectToWA()
}, 4000);
