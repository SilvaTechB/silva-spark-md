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
  areJidsSameUser,
  downloadContentFromMessage,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID,
  makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers,
  makeCacheableSignalKeyStore,
  isJidUser,
  isJidGroup
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

const prefix = config.PREFIX || '.'

const ownerNumber = ['254743706010']

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

// ------------------------------------------------------------------
// Reconnect / failure-guard state
// ------------------------------------------------------------------
let reconnectAttempts = 0
const MAX_BACKOFF_MS = 60000
const MAX_CONSECUTIVE_405 = 3
let consecutive405 = 0
let totalWipes = 0
let isReconnecting = false
let connectionTimeout = null

function wipeSession(reason) {
    try {
        const sessionDir = path.join(__dirname, 'sessions')
        if (fs.existsSync(sessionDir)) {
            fs.rmSync(sessionDir, { recursive: true, force: true })
            fs.mkdirSync(sessionDir, { recursive: true })
        }
        const credsPath = path.join(__dirname, 'sessions', 'creds.json')
        if (fs.existsSync(credsPath)) {
            fs.unlinkSync(credsPath)
        }
        totalWipes++
        botLogger.log('WARNING', `♻️ Session wiped (${reason}). A fresh QR code will be generated.`)
    } catch (e) {
        botLogger.log('ERROR', 'Failed to wipe session: ' + e.message)
    }
}

async function loadSession() {
    try {
        const credsPath = './sessions/creds.json';

        if (!fs.existsSync('./sessions')) {
            fs.mkdirSync('./sessions', { recursive: true });
        }

        if (fs.existsSync(credsPath)) {
            try {
                const credsData = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
                if (!credsData || !credsData.me || !credsData.me.id) {
                    fs.unlinkSync(credsPath);
                    botLogger.log('INFO', "♻️ Invalid session removed");
                    return false;
                }
                if (credsData.registration && credsData.registration.timestamp) {
                    const sessionAge = Date.now() - credsData.registration.timestamp;
                    if (sessionAge > 30 * 24 * 60 * 60 * 1000) {
                        fs.unlinkSync(credsPath);
                        botLogger.log('INFO', "♻️ Session expired (older than 30 days)");
                        return false;
                    }
                }
            } catch (e) {
                try {
                    fs.unlinkSync(credsPath);
                    botLogger.log('INFO', "♻️ Corrupted session removed");
                } catch (err) {}
                return false;
            }
        }

        if (!config.SESSION_ID || typeof config.SESSION_ID !== 'string' || config.SESSION_ID === '') {
            botLogger.log('WARNING', "SESSION_ID missing or empty, using QR");
            return false;
        }

        const [header, b64data] = config.SESSION_ID.split('~');
        if (header !== "Silva" || !b64data || b64data.length < 10) {
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
let pluginsLoaded = false;

// ==============================
// 🔧 Helper Functions with Error Handling
// ==============================

const safeBufferSize = (size) => {
    if (typeof size !== 'number' || isNaN(size) || size < 0 || size > 9007199254740991) {
        return 0;
    }
    return size;
};

const getSizeMedia = async (data) => {
    try {
        if (!data) return 0;
        if (Buffer.isBuffer(data)) {
            return data.length;
        }
        if (typeof data === 'string') {
            if (fs.existsSync(data)) {
                const stats = fs.statSync(data);
                return stats.size || 0;
            }
            return data.length || 0;
        }
        if (data && typeof data === 'object') {
            if (data.length !== undefined) {
                return safeBufferSize(data.length);
            }
            if (data.headers && data.headers['content-length']) {
                const size = parseInt(data.headers['content-length']);
                return safeBufferSize(size);
            }
        }
        return 0;
    } catch (e) {
        console.log('getSizeMedia error:', e.message);
        return 0;
    }
};

const safeBufferFrom = (data, encoding) => {
    try {
        if (!data) return Buffer.alloc(0);
        if (Buffer.isBuffer(data)) return data;
        if (typeof data === 'string') {
            return Buffer.from(data, encoding || 'utf8');
        }
        if (data && typeof data === 'object' && data.length !== undefined) {
            const size = safeBufferSize(data.length);
            if (size === 0) return Buffer.alloc(0);
            return Buffer.from(data);
        }
        return Buffer.alloc(0);
    } catch (e) {
        console.log('safeBufferFrom error:', e.message);
        return Buffer.alloc(0);
    }
};

//=============================================

// ==============================
// 🔄 COMMAND HANDLER
// ==============================
const commandHandler = {
    commands: new Map(),
    
    registerCommand(name, func, options = {}) {
        this.commands.set(name.toLowerCase(), {
            func,
            options,
            pattern: options.pattern || name.toLowerCase(),
            alias: options.alias || [],
            react: options.react || '⚡',
            on: options.on || 'body'
        });
    },
    
    getCommand(cmdName) {
        const cmd = this.commands.get(cmdName.toLowerCase());
        if (cmd) return cmd;
        
        // Check aliases
        for (const [name, cmdData] of this.commands) {
            if (cmdData.alias && cmdData.alias.includes(cmdName.toLowerCase())) {
                return cmdData;
            }
        }
        return null;
    }
};

// ==============================
// 🔌 CONNECTION FUNCTION
// ==============================
async function connectToWA() {
    if (isReconnecting) {
        botLogger.log('WARNING', 'Connection attempt already in progress, skipping...');
        return;
    }
    isReconnecting = true;

    try {
        console.log("Connecting silva spark to WhatsApp ⏳️...");

        await loadSession();

        const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/')
        
        let version, isLatest;
        try {
            const result = await fetchLatestBaileysVersion();
            const fetchedVersion = result.version;
            if (
                !Array.isArray(fetchedVersion) ||
                fetchedVersion.length !== 3 ||
                fetchedVersion.some((part) => !Number.isInteger(part) || part < 0)
            ) {
                throw new Error(`Invalid WhatsApp version returned: ${JSON.stringify(fetchedVersion)}`);
            }
            version = fetchedVersion;
            isLatest = result.isLatest;
            botLogger.log('INFO', `Using WA v${version.join('.')}, isLatest: ${isLatest}`)
        } catch (e) {
            botLogger.log('WARNING', 'Failed to fetch latest version, using fallback: ' + e.message);
            version = [2, 3000, 1015901307];
            isLatest = false;
        }

        const conn = makeWASocket({
            logger: P({ level: 'silent' }),
            browser: ['Silva Spark MD', 'Chrome', '120.0.0.0'],
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
                return { conversation: '' }
            },
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 10000,
            emitOwnEvents: true,
            fireInitQueries: true,
            generateHighQualityLinkPreview: false,
            patchMessageBeforeSending: (message) => {
                const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage);
                if (requiresPatch) {
                    message = {
                        viewOnceMessage: {
                            message: {
                                messageContextInfo: {
                                    deviceListMetadataVersion: 2,
                                    deviceListMetadata: {}
                                },
                                ...message
                            }
                        }
                    };
                }
                return message;
            },
            markOnlineOnConnect: true,
            retryRequestDelayMs: 1000,
            maxRetries: 3
        })

        conn.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update

            if (qr) {
                console.log('QR Code received, scan with WhatsApp:')
                qrcode.generate(qr, { small: true })
                isReconnecting = false;
            }

            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut
                console.log('Connection closed due to:', lastDisconnect?.error, ', reconnecting:', shouldReconnect)

                if (!shouldReconnect) {
                    console.log('Logged out. Please delete sessions folder and restart.')
                    wipeSession('logged out')
                    isReconnecting = false;
                    return
                }

                if (statusCode === 405) {
                    consecutive405++
                    botLogger.log('WARNING', `405 Connection Failure (${consecutive405}/${MAX_CONSECUTIVE_405})`)
                    
                    if (consecutive405 >= MAX_CONSECUTIVE_405) {
                        wipeSession('repeated 405 Connection Failure')
                        consecutive405 = 0
                        reconnectAttempts = 0
                        isReconnecting = false;
                        setTimeout(connectToWA, 5000);
                        return
                    }
                } else {
                    consecutive405 = 0
                }

                reconnectAttempts++
                const delay = Math.min(1000 * Math.pow(1.5, reconnectAttempts), MAX_BACKOFF_MS)
                botLogger.log('INFO', `Reconnecting in ${Math.round(delay / 1000)}s... (Attempt ${reconnectAttempts})`)
                
                if (connectionTimeout) {
                    clearTimeout(connectionTimeout);
                }
                
                connectionTimeout = setTimeout(() => {
                    isReconnecting = false;
                    connectToWA();
                }, delay);
            } else if (connection === 'open') {
                reconnectAttempts = 0
                consecutive405 = 0
                isReconnecting = false
                
                if (connectionTimeout) {
                    clearTimeout(connectionTimeout);
                    connectionTimeout = null;
                }

                if (!pluginsLoaded) {
                    console.log('🧬 Installing silva spark Plugins')
                    try {
                        const pluginFiles = fs.readdirSync("./plugins/");
                        for (const plugin of pluginFiles) {
                            if (path.extname(plugin).toLowerCase() == ".js") {
                                require("./plugins/" + plugin);
                            }
                        }
                        console.log('Plugins installed successful ✅')
                        pluginsLoaded = true
                    } catch (e) {
                        console.log('Plugin loading error:', e.message);
                    }
                }
                console.log('Bot connected to whatsapp ✅')

                try {
                    let up = `*Hello there ✦ Silva ✦ Spark ✦ MD ✦ User! 👋🏻* \n\n> This is a user friendly whatsapp bot created by Silva Tech Inc 🎊, Meet ✦ Silva ✦ Spark ✦ MD ✦ WhatsApp Bot.\n\n *Thanks for using ✦ Silva ✦ Spark ✦ MD ✦ 🚩* \n\n> follow WhatsApp Channel :- 💖\n \nhttps://whatsapp.com/channel/0029VaAkETLLY6d8qhLmZt2v\n\n- *YOUR PREFIX:* = ${prefix}\n\nDont forget to give star to repo ⬇️\n\nhttps://github.com/SilvaTechB/silva-spark-md\n\n> © Powered BY ✦ Silva ✦ Spark ✦ MD ✦ 🖤`;
                    await conn.sendMessage(conn.user.id, {
                        text: up,
                        contextInfo: globalContextInfo
                    });
                } catch (e) {
                    console.log('Welcome message error:', e.message);
                }
            }
        })

        conn.ev.on('creds.update', saveCreds)

        // ==============================
        // 📥 STORE MESSAGES FOR ANTI-DELETE
        // ==============================
        conn.ev.on('messages.upsert', async (m) => {
            const msg = m.messages[0];
            if (!msg.message) return;

            if (msg.key.remoteJid === 'status@broadcast') {
                return;
            }

            const messageKey = `${msg.key.remoteJid}_${msg.key.id}`;
            messageStore.set(messageKey, {
                message: msg,
                sender: msg.key.participant || msg.key.remoteJid,
                chat: msg.key.remoteJid,
                timestamp: Date.now()
            });

            messageStore.set(msg.key.id, msg);

            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
            for (const [key, value] of messageStore.entries()) {
                if (value.timestamp && value.timestamp < oneDayAgo) {
                    messageStore.delete(key);
                }
            }
        });

        // ==============================
        // 🗑️ ANTI-DELETE HANDLER
        // ==============================
        conn.ev.on('messages.update', async (updates) => {
            for (const update of updates) {
                try {
                    if (update.update.message === null) {
                        const messageKey = `${update.key.remoteJid}_${update.key.id}`;
                        const storedMessage = messageStore.get(messageKey);

                        if (update.key.remoteJid === 'status@broadcast') {
                            continue;
                        }

                        if (storedMessage && config.ANTI_DELETE === "true") {
                            const ownerJid = ownerNumber[0] + '@s.whatsapp.net';
                            const isGroup = storedMessage.chat.endsWith('@g.us');

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

                            await conn.sendMessage(ownerJid, {
                                text: notificationText,
                                mentions: [deletedBy, storedMessage.sender],
                                contextInfo: globalContextInfo
                            });

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

                            messageStore.delete(messageKey);
                        }
                    }
                } catch (e) {
                    console.log('Anti-delete error:', e.message);
                }
            }
        });

        //=============MAIN MESSAGE HANDLER===============
        conn.ev.on('messages.upsert', async (mek) => {
            try {
                mek = mek.messages[0]
                if (!mek.message) return
                
                // Handle ephemeral messages
                mek.message = (getContentType(mek.message) === 'ephemeralMessage')
                    ? mek.message.ephemeralMessage.message
                    : mek.message;

                // Mark messages as read
                if (config.READ_MESSAGE === 'true') {
                    await conn.readMessages([mek.key]);
                    console.log(`Marked message from ${mek.key.remoteJid} as read.`);
                }

                // Handle status updates with better error handling
                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    // Auto-seen status
                    if (config.AUTO_STATUS_SEEN === "true") {
                        await conn.readMessages([mek.key]);
                    }

                    // Auto-react to status with better error handling
                    if (config.AUTO_STATUS_REACT === "true") {
                        try {
                            // Check if status is still valid (not expired)
                            const now = Date.now();
                            const statusTimestamp = mek.messageTimestamp || 0;
                            const statusAge = now - (statusTimestamp * 1000);
                            
                            // Only react if status is less than 24 hours old
                            if (statusAge < 24 * 60 * 60 * 1000) {
                                const jawadlike = await conn.decodeJid(conn.user.id);
                                const emojis = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '💜', '💙', '🌝', '💚'];
                                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                                
                                if (mek.key.participant) {
                                    await conn.sendMessage(mek.key.remoteJid, {
                                        react: {
                                            text: randomEmoji,
                                            key: mek.key,
                                        }
                                    }, { statusJidList: [mek.key.participant, jawadlike] });
                                }
                            }
                        } catch (e) {
                            // Silent fail for status react - don't flood logs
                            // Only log if it's not a "not-acceptable" error
                            if (!e.message.includes('not-acceptable')) {
                                console.log('Status react error:', e.message);
                            }
                        }
                    }

                    // Auto-reply to status
                    if (config.AUTO_STATUS_REPLY === "true") {
                        try {
                            const user = mek.key.participant
                            if (user) {
                                const text = `${config.AUTO_STATUS__MSG || 'Nice status!'}`
                                await conn.sendMessage(user, { 
                                    text: text, 
                                    react: { text: '✈️', key: mek.key } 
                                }, { quoted: mek })
                            }
                        } catch (e) {
                            console.log('Status reply error:', e.message);
                        }
                    }
                    
                    return; // Don't process status messages further
                }

                // Handle view-once messages
                let jawadik = mek.message.viewOnceMessageV2 || mek.message.viewOnceMessageV2Extension

                if (jawadik && config.ANTI_VV === "true") {
                    try {
                        if (jawadik.message.imageMessage) {
                            let cap = jawadik.message.imageMessage.caption || '';
                            let anu = await conn.downloadAndSaveMediaMessage(jawadik.message.imageMessage);
                            await conn.sendMessage("254700143167@s.whatsapp.net", {
                                image: { url: anu },
                                caption: cap,
                                contextInfo: globalContextInfo
                            }, { quoted: mek });
                            // Clean up
                            if (fs.existsSync(anu)) fs.unlinkSync(anu);
                        }
                        if (jawadik.message.videoMessage) {
                            let cap = jawadik.message.videoMessage.caption || '';
                            let anu = await conn.downloadAndSaveMediaMessage(jawadik.message.videoMessage);
                            await conn.sendMessage("254700143167@s.whatsapp.net", {
                                video: { url: anu },
                                caption: cap,
                                contextInfo: globalContextInfo
                            }, { quoted: mek });
                            if (fs.existsSync(anu)) fs.unlinkSync(anu);
                        }
                        if (jawadik.message.audioMessage) {
                            let anu = await conn.downloadAndSaveMediaMessage(jawadik.message.audioMessage);
                            await conn.sendMessage("254700143167@s.whatsapp.net", {
                                audio: { url: anu },
                                contextInfo: globalContextInfo
                            }, { quoted: mek });
                            if (fs.existsSync(anu)) fs.unlinkSync(anu);
                        }
                    } catch (e) {
                        console.log('Anti-VV error:', e.message);
                    }
                }

                // ==============================
                // 📝 MESSAGE PROCESSING
                // ==============================
                const m = sms(conn, mek)
                const type = getContentType(mek.message)
                const from = mek.key.remoteJid
                
                // Skip if from is invalid
                if (!from) return;

                const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null 
                    ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] 
                    : []
                
                // Get message body
                let body = ''
                if (type === 'conversation') {
                    body = mek.message.conversation || ''
                } else if (type === 'extendedTextMessage') {
                    body = mek.message.extendedTextMessage.text || ''
                } else if (type === 'imageMessage' && mek.message.imageMessage.caption) {
                    body = mek.message.imageMessage.caption || ''
                } else if (type === 'videoMessage' && mek.message.videoMessage.caption) {
                    body = mek.message.videoMessage.caption || ''
                }

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
                // Extend conn with helper methods
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

                conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
                    try {
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
                    } catch (e) {
                        console.log('sendFileUrl error:', e.message);
                        return null;
                    }
                }

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

                conn.getFile = async (PATH, save) => {
                    try {
                        let res
                        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? safeBufferFrom(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
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
                    } catch (e) {
                        console.log('getFile error:', e.message);
                        return {
                            res: null,
                            filename: null,
                            size: 0,
                            mime: 'application/octet-stream',
                            ext: '.bin',
                            data: Buffer.alloc(0)
                        }
                    }
                }

                conn.sendFile = async (jid, PATH, fileName, quoted = {}, options = {}) => {
                    try {
                        let types = await conn.getFile(PATH, true)
                        let { filename, size, ext, mime, data } = types
                        let type = '',
                            mimetype = mime,
                            pathFile = filename
                        if (options.asDocument) type = 'document'
                        if (options.asSticker || /webp/.test(mime)) {
                            let { writeExif } = require('./exif.js')
                            let media = { mimetype: mime, data }
                            pathFile = await writeExif(media, { packname: config.packname || 'Silva Spark', author: config.author || 'Silva Tech', categories: options.categories ? options.categories : [] })
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
                    } catch (e) {
                        console.log('sendFile error:', e.message);
                        return null;
                    }
                }

                conn.parseMention = async (text) => {
                    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
                }

                conn.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
                    try {
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
                            pathFile = await writeExif(media, { packname: options.packname ? options.packname : config.packname || 'Silva Spark', author: options.author ? options.author : config.author || 'Silva Tech', categories: options.categories ? options.categories : [] })
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
                    } catch (e) {
                        console.log('sendMedia error:', e.message);
                        return null;
                    }
                }

                conn.sendVideoAsSticker = async (jid, buff, options = {}) => {
                    try {
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
                    } catch (e) {
                        console.log('sendVideoAsSticker error:', e.message);
                    }
                };

                conn.sendImageAsSticker = async (jid, buff, options = {}) => {
                    try {
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
                    } catch (e) {
                        console.log('sendImageAsSticker error:', e.message);
                    }
                };

                conn.sendTextWithMentions = async (jid, text, quoted, options = {}) => conn.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), ...globalContextInfo }, ...options }, { quoted })

                conn.sendImage = async (jid, path, caption = '', quoted = '', options) => {
                    try {
                        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? safeBufferFrom(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
                        return await conn.sendMessage(jid, { image: buffer, caption: caption, contextInfo: globalContextInfo, ...options }, { quoted })
                    } catch (e) {
                        console.log('sendImage error:', e.message);
                        return null;
                    }
                }

                conn.sendText = (jid, text, quoted = '', options) => conn.sendMessage(jid, { text: text, contextInfo: globalContextInfo, ...options }, { quoted })

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

                //==========Auto Reactions============//
                // Only react if not already a reaction and sender is not bot
                if (!isReact && senderNumber !== botNumber && !isGroup) {
                    if (config.AUTO_REACT === 'true') {
                        const reactions = ['😊', '👍', '😂', '💯', '🔥', '🙏', '🎉', '👏', '😎', '🤖'];
                        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
                        m.react(randomReaction);
                    }
                }

                //==========WORKTYPE============
                if (!isOwner && config.MODE === "private") return
                if (!isOwner && isGroup && config.MODE === "inbox") return
                if (!isOwner && !isGroup && config.MODE === "groups") return

                // ==============================
                // 📋 COMMAND EXECUTION
                // ==============================
                if (isCmd) {
                    const cmdName = body.slice(prefix.length).trim().split(" ")[0].toLowerCase();
                    
                    // Load plugins if not already loaded
                    if (!pluginsLoaded) {
                        console.log('🧬 Installing silva spark Plugins')
                        try {
                            const pluginFiles = fs.readdirSync("./plugins/");
                            for (const plugin of pluginFiles) {
                                if (path.extname(plugin).toLowerCase() == ".js") {
                                    const pluginModule = require("./plugins/" + plugin);
                                    // Register plugin commands if they exist
                                    if (pluginModule && pluginModule.command) {
                                        const cmdData = pluginModule.command;
                                        const func = pluginModule.function || pluginModule.execute || pluginModule.run;
                                        if (func) {
                                            commandHandler.registerCommand(
                                                cmdData.name || cmdName,
                                                func,
                                                {
                                                    pattern: cmdData.pattern || cmdData.name,
                                                    alias: cmdData.alias || [],
                                                    react: cmdData.react || '⚡',
                                                    on: cmdData.on || 'body'
                                                }
                                            );
                                        }
                                    }
                                }
                            }
                            console.log('Plugins installed successful ✅')
                            pluginsLoaded = true
                        } catch (e) {
                            console.log('Plugin loading error:', e.message);
                        }
                    }

                    // Find and execute command
                    const cmd = commandHandler.getCommand(cmdName);
                    if (cmd) {
                        // Send reaction if configured
                        if (cmd.react) {
                            try {
                                await conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } });
                            } catch (e) {
                                // Silent fail for reaction
                            }
                        }

                        try {
                            // Execute command with context
                            await cmd.func(conn, mek, m, {
                                from, 
                                quoted, 
                                body, 
                                isCmd, 
                                command: cmdName, 
                                args, 
                                q, 
                                isGroup, 
                                sender, 
                                senderNumber, 
                                botNumber2, 
                                botNumber, 
                                pushname, 
                                isMe, 
                                isOwner, 
                                groupMetadata, 
                                groupName, 
                                participants, 
                                groupAdmins, 
                                isBotAdmins, 
                                isAdmins, 
                                reply,
                                prefix
                            });
                        } catch (e) {
                            console.error("[PLUGIN ERROR] " + e);
                            reply(`❌ Error executing command: ${e.message}`);
                        }
                    }
                }
            } catch (e) {
                console.log('Messages.upsert error:', e.message);
            }
        })

        // Handle decryption errors gracefully
        conn.ev.on('decryption.error', (error) => {
            console.log('Decryption error encountered, retrying...');
        });

        return conn;

    } catch (error) {
        botLogger.log('ERROR', 'Connection error: ' + (error.stack || error.message));
        isReconnecting = false;
        setTimeout(connectToWA, 5000);
    }
}

app.get("/", (req, res) => {
    res.send("silva spark RUNNING ✅");
});
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

setTimeout(() => {
    connectToWA()
}, 4000);
