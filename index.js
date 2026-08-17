/*
 * Gifted Baileys supports status reactions through the same
 * statusJidList/sendMessage API used below. Select it with:
 *
 *   BAILEYS_PACKAGE=gifted-baileys
 *
 * The fallback keeps the script compatible with existing deployments that
 * have only @whiskeysockets/baileys installed. Do not alias one package to
 * the other in package.json: their internal versions and session behavior
 * are not interchangeable.
 */
const baileysPackage = process.env.BAILEYS_PACKAGE || 'gifted-baileys'
let baileys

try {
  baileys = require(baileysPackage)
  console.log(`Using WhatsApp library: ${baileysPackage}`)
} catch (primaryError) {
  if (baileysPackage !== '@whiskeysockets/baileys') {
    console.log(`Could not load ${baileysPackage}: ${primaryError.message}`)
    console.log('Falling back to @whiskeysockets/baileys')
    baileys = require('@whiskeysockets/baileys')
  } else {
    throw primaryError
  }
}

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
} = baileys

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
const prefix = String(config.PREFIX || '.')

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
        if (err) {
            console.log('Temporary directory cleanup error:', err.message);
            return;
        }
        for (const file of files) {
            fs.unlink(path.join(tempDir, file), err => {
                if (err) console.log('Temporary file cleanup error:', err.message);
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

// ------------------------------------------------------------------
// Reconnect / failure-guard state
// ------------------------------------------------------------------
let reconnectAttempts = 0
const MAX_BACKOFF_MS = 60_000
const MAX_CONSECUTIVE_405 = 3
let consecutive405 = 0
let totalWipes = 0
let isReconnecting = false
let connectionTimeout = null
let sessionIdBootstrapEnabled = true

/*
 * ------------------------------------------------------------------
 * SESSION_ID change detection
 * ------------------------------------------------------------------
 * This marker lives OUTSIDE the `sessions/` folder on purpose. wipeSession()
 * only clears `sessions/`, so this file survives a 405-triggered wipe and
 * lets us tell the difference between:
 *   - the SAME bad SESSION_ID being retried after a wipe (do NOT re-enable
 *     bootstrap forever, or we'd loop hammering WhatsApp with a dead ID)
 *   - a genuinely NEW SESSION_ID the user just pasted in (ALWAYS honor it,
 *     even if a stale local session currently exists on disk)
 *
 * A real fresh deploy (new slug/build) removes this file along with
 * everything else, which is fine — it just means bootstrap starts clean.
 * ------------------------------------------------------------------
 */
const sessionMarkerPath = path.join(__dirname, '.session_id.hash')

function getCleanSessionId() {
    // Trims whitespace/newlines and strips accidental surrounding quotes —
    // a very common cause of "invalid session" when copy-pasting SESSION_ID
    // from a browser or chat app.
    return (config.SESSION_ID || '').toString().trim().replace(/^["']+|["']+$/g, '')
}

function hashSessionId(id) {
    if (!id) return null
    return Crypto.createHash('sha256').update(id).digest('hex')
}

function getStoredSessionIdHash() {
    try {
        if (fs.existsSync(sessionMarkerPath)) {
            return fs.readFileSync(sessionMarkerPath, 'utf8').trim()
        }
    } catch (e) {}
    return null
}

function storeSessionIdHash(hash) {
    try {
        fs.writeFileSync(sessionMarkerPath, hash || '', 'utf8')
    } catch (e) {
        botLogger.log('ERROR', 'Failed to store SESSION_ID marker: ' + e.message)
    }
}

function wipeSession(reason, { disableSessionIdBootstrap = false } = {}) {
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
        if (disableSessionIdBootstrap) {
            sessionIdBootstrapEnabled = false
            botLogger.log('WARNING', 'SESSION_ID bootstrap disabled; the next connection will require a fresh QR/pairing session')
        }
        botLogger.log('WARNING', `♻️ Session wiped (${reason}). A fresh QR code will be generated.`)
        if (totalWipes >= 2) {
            botLogger.log('ERROR',
                '⚠️ Session has been wiped multiple times. This usually means:\n' +
                '1. The stored WhatsApp session was rejected with 405\n' +
                '2. Your SESSION_ID may be invalid, expired, or already logged out\n' +
                '3. Gifted Baileys may require a fresh QR/pairing session\n' +
                '4. If you just pasted a NEW SESSION_ID, double check for stray\n' +
                '   whitespace/quotes and that it matches this bot\'s pairing tool\n' +
                '5. Scan the next QR code instead of reusing the old SESSION_ID'
            )
        }
    } catch (e) {
        botLogger.log('ERROR', 'Failed to wipe session: ' + e.message)
    }
}

async function loadSession() {
    try {
        const sessionDir = path.join(__dirname, 'sessions')
        const credsPath = path.join(sessionDir, 'creds.json');
        let hasUsableLocalSession = false;

        if (!fs.existsSync(sessionDir)) {
            fs.mkdirSync(sessionDir, { recursive: true });
        }

        // ------------------------------------------------------------
        // If the SESSION_ID config var has changed since we last
        // bootstrapped from one, ALWAYS prefer it — this is what makes a
        // freshly-pasted SESSION_ID actually take effect instead of being
        // silently shadowed by "existing local session" logic below.
        // ------------------------------------------------------------
        const cleanSessionId = getCleanSessionId()
        const currentHash = hashSessionId(cleanSessionId)
        const storedHash = getStoredSessionIdHash()
        const sessionIdChanged = Boolean(currentHash) && currentHash !== storedHash

        if (sessionIdChanged) {
            botLogger.log('INFO', '🔄 New SESSION_ID detected — discarding any local session and re-enabling bootstrap')
            if (fs.existsSync(sessionDir)) {
                fs.rmSync(sessionDir, { recursive: true, force: true })
                fs.mkdirSync(sessionDir, { recursive: true })
            }
            sessionIdBootstrapEnabled = true
            consecutive405 = 0
        }

        if (fs.existsSync(credsPath)) {
            try {
                const credsData = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
                if (!credsData || !credsData.me || !credsData.me.id) {
                    fs.unlinkSync(credsPath);
                    botLogger.log('INFO', "♻️ Invalid session removed");
                } else if (credsData.registration && credsData.registration.timestamp) {
                    const sessionAge = Date.now() - credsData.registration.timestamp;
                    if (sessionAge > 30 * 24 * 60 * 60 * 1000) {
                        fs.unlinkSync(credsPath);
                        botLogger.log('INFO', "♻️ Session expired (older than 30 days)");
                    } else {
                        hasUsableLocalSession = true;
                    }
                } else {
                    hasUsableLocalSession = true;
                }
            } catch (e) {
                try {
                    fs.unlinkSync(credsPath);
                    botLogger.log('INFO', "♻️ Corrupted session removed");
                } catch (err) {}
            }
        }

        /*
         * Do not overwrite an active multi-file session with the original
         * SESSION_ID on every restart. SESSION_ID is only a bootstrap
         * credential for a fresh filesystem. Replacing current creds with an
         * older copy causes "No sessions" and repeated "Bad MAC" errors.
         *
         * NOTE: this branch is only reachable when sessionIdChanged is
         * false — see the forced wipe above.
         */
        if (hasUsableLocalSession) {
            botLogger.log('INFO', "Existing local session kept; SESSION_ID was not reloaded");
            return true;
        }

        if (!sessionIdBootstrapEnabled) {
            botLogger.log('INFO', "SESSION_ID bootstrap skipped after a rejected session; waiting for QR/pairing");
            return false;
        }

        if (!cleanSessionId) {
            botLogger.log('WARNING', "SESSION_ID missing or empty, using QR");
            return false;
        }

        const [header, b64data] = cleanSessionId.split('~');
        if (header !== "Silva" || !b64data || b64data.length < 10) {
            botLogger.log('ERROR', "Invalid session format");
            return false;
        }

        const cleanB64 = b64data.replace(/\.\.\./g, '');
        const compressedData = Buffer.from(cleanB64, 'base64');
        const decompressedData = zlib.gunzipSync(compressedData);
        fs.writeFileSync(credsPath, decompressedData, "utf8");
        storeSessionIdHash(currentHash); // remember which SESSION_ID this creds.json came from
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

// Safe buffer size function - prevents NaN errors
const safeBufferSize = (size) => {
    if (typeof size !== 'number' || isNaN(size) || size < 0 || size > 9007199254740991) {
        return 0; // Return 0 as safe default
    }
    return size;
};

// Safe getSizeMedia function - handles NaN properly
const getSizeMedia = async (data) => {
    try {
        if (!data) return 0;
        if (Buffer.isBuffer(data)) {
            return data.length;
        }
        if (typeof data === 'string') {
            // If it's a file path, check file size
            if (fs.existsSync(data)) {
                const stats = fs.statSync(data);
                return stats.size || 0;
            }
            // If it's a URL or base64 string, estimate size
            return data.length || 0;
        }
        if (data && typeof data === 'object') {
            // If it has a length property
            if (data.length !== undefined) {
                return safeBufferSize(data.length);
            }
            // If it's a stream or response
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

// Safe Buffer.from wrapper
const safeBufferFrom = (data, encoding) => {
    try {
        if (!data) return Buffer.alloc(0);
        if (Buffer.isBuffer(data)) return data;
        if (typeof data === 'string') {
            return Buffer.from(data, encoding || 'utf8');
        }
        // If data is an object with a length property
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

// Normalize WhatsApp device JIDs before comparing them.
const decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
        const decode = jidDecode(jid) || {};
        return (decode.user && decode.server)
            ? `${decode.user}@${decode.server}`
            : jid;
    }
    return jid;
};

const normalizeJid = (jid) => {
    if (!jid) return '';
    try {
        return jidNormalizedUser(decodeJid(jid));
    } catch (e) {
        return decodeJid(jid);
    }
};

const sameJid = (left, right) => {
    const normalizedLeft = normalizeJid(left);
    const normalizedRight = normalizeJid(right);
    return Boolean(normalizedLeft && normalizedRight && normalizedLeft === normalizedRight);
};

const getStatusReactionKey = (message) => {
    const participant = normalizeJid(message?.key?.participant);
    if (!participant || !message?.key?.id) return null;
    return {
        remoteJid: 'status@broadcast',
        fromMe: false,
        id: message.key.id,
        participant
    };
};

const STATUS_REACTION_TIMEOUT_MS = 8000;
const STATUS_REACTION_COOLDOWN_MS = 5 * 60 * 1000;
const statusReactionsInFlight = new Set();
let statusReactionTimeouts = 0;
let statusReactionsDisabledUntil = 0;

const withTimeout = (promise, timeoutMs, message) => {
    let timeout;
    const timeoutPromise = new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error(message)), timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]).finally(() => {
        clearTimeout(timeout);
    });
};

const sendStatusReaction = async (conn, message) => {
    const statusKey = getStatusReactionKey(message);
    const statusOwner = statusKey?.participant;
    const botJid = normalizeJid(conn.user?.id);

    if (
        !statusKey ||
        !statusOwner ||
        statusOwner === botJid ||
        statusReactionsDisabledUntil > Date.now() ||
        statusReactionsInFlight.has(statusKey.id)
    ) {
        return;
    }

    statusReactionsInFlight.add(statusKey.id);

    try {
        const emojis = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '💜', '💙', '🌝', '🖤', '💚'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        /*
         * A status reaction is optional. Never let a slow/rejected status
         * request block the normal messages.upsert command pipeline.
         */
        await withTimeout(
            conn.sendMessage('status@broadcast', {
                react: {
                    text: randomEmoji,
                    key: statusKey,
                }
            }, { statusJidList: [statusOwner] }),
            STATUS_REACTION_TIMEOUT_MS,
            'Status reaction timed out',
        );

        statusReactionTimeouts = 0;
    } catch (error) {
        const errorText = String(error?.message || error);
        if (/timed out/i.test(errorText)) {
            statusReactionTimeouts += 1;
            if (statusReactionTimeouts >= 3) {
                statusReactionsDisabledUntil = Date.now() + STATUS_REACTION_COOLDOWN_MS;
                statusReactionTimeouts = 0;
                console.log('Status reactions paused for 5 minutes after repeated timeouts');
            }
        } else if (!/not-acceptable|forbidden|unauthorized/i.test(errorText)) {
            console.log('Status react error:', errorText);
        }
    } finally {
        statusReactionsInFlight.delete(statusKey.id);
    }
};

//=============================================

async function connectToWA() {
    if (isReconnecting) {
        botLogger.log('WARNING', 'Connection attempt already in progress, skipping...');
        return;
    }
    isReconnecting = true;

    try {
        console.log("Connecting silva spark to WhatsApp ⏳️...");

        await loadSession();

        const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'sessions'))
        
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
                const stored = messageStore.get(key.id);
                if (stored) {
                    return stored.message || stored;
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

        // These helpers are attached before any message can be processed.
        conn.decodeJid = decodeJid;

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
                    wipeSession('logged out', { disableSessionIdBootstrap: true })
                    isReconnecting = false;
                    return
                }

                if (statusCode === 405) {
                    consecutive405++
                    botLogger.log('WARNING', `405 Connection Failure (${consecutive405}/${MAX_CONSECUTIVE_405})`)
                    
                    if (consecutive405 >= MAX_CONSECUTIVE_405) {
                        wipeSession('repeated 405 Connection Failure', { disableSessionIdBootstrap: true })
                        consecutive405 = 0
                        // Growing cooldown after each wipe so a bad/expired
                        // SESSION_ID doesn't hammer WhatsApp every few
                        // seconds — that flapping can itself provoke more
                        // 405s. Capped at 5 minutes.
                        const wipeCooldown = Math.min(5000 * totalWipes, 5 * 60 * 1000)
                        botLogger.log('INFO', `Waiting ${Math.round(wipeCooldown / 1000)}s before next attempt (wipe #${totalWipes})`)
                        reconnectAttempts = 0
                        isReconnecting = false;
                        setTimeout(connectToWA, wipeCooldown);
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
                totalWipes = 0
                isReconnecting = false
                
                if (connectionTimeout) {
                    clearTimeout(connectionTimeout);
                    connectionTimeout = null;
                }

                if (!pluginsLoaded) {
                    console.log('🧬 Installing silva spark Plugins')
                    try {
                        const pluginDir = path.join(__dirname, 'plugins');
                        const pluginFiles = fs.existsSync(pluginDir) ? fs.readdirSync(pluginDir) : [];
                        for (const plugin of pluginFiles) {
                            if (path.extname(plugin).toLowerCase() == ".js") {
                                require(path.join(pluginDir, plugin));
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
            if (!msg?.message) return;

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

        //=============readstatus=======

        conn.ev.on('messages.upsert', async (mek) => {
            try {
                mek = mek.messages[0]
                if (!mek?.message) return
                mek.message = (getContentType(mek.message) === 'ephemeralMessage')
                ? mek.message.ephemeralMessage.message
                : mek.message;

                /*
                 * Status messages must exit this handler after their optional
                 * status actions. Falling through to normal command handling
                 * is what made status updates behave like ordinary messages.
                 */
                const isStatus = mek.key?.remoteJid === 'status@broadcast';

                if (isStatus && config.AUTO_STATUS_SEEN === "true") {
                    try {
                        await conn.readMessages([mek.key])
                    } catch (e) {
                        console.log('Status seen error:', e.message);
                    }
                }

                if (isStatus && config.AUTO_STATUS_REACT === "true") {
                    // Status reactions are deliberately fire-and-forget so a
                    // WhatsApp timeout cannot delay group command handling.
                    void sendStatusReaction(conn, mek);
                }

                if (isStatus && config.AUTO_STATUS_REPLY === "true") {
                    try {
                        const user = normalizeJid(mek.key.participant)
                        if (user) {
                            const text = `${config.AUTO_STATUS__MSG || 'Nice status!'}`
                            // Reply to the status owner separately. Do not
                            // attach a status reaction to a normal chat send.
                            await conn.sendMessage(user, { text: text }, { quoted: mek })
                        }
                    } catch (e) {
                        console.log('Status reply error:', e.message);
                    }
                }

                if (isStatus) return;

                if (config.READ_MESSAGE === 'true') {
                    try {
                        await conn.readMessages([mek.key]);
                        console.log(`Marked message from ${mek.key.remoteJid} as read.`);
                    } catch (e) {
                        console.log('Read message error:', e.message);
                    }
                }

                if (mek.message.viewOnceMessageV2)
                    mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message

                let jawadik = mek.message.viewOnceMessageV2

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
                const from = mek.key.remoteJid
                if (!from) return
                const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
                const body = ((type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : '') || ''
                const isCmd = body.startsWith(prefix)
                const command = isCmd ? body.slice(prefix.length).trim().split(/\s+/).shift().toLowerCase() : ''
                const args = body.trim().split(/ +/).slice(1)
                const q = args.join(' ')
                const isGroup = from.endsWith('@g.us')
                const botNumber2 = normalizeJid(conn.user?.id)
                const botNumber = botNumber2.split('@')[0]
                const sender = mek.key.fromMe ? botNumber2 : normalizeJid(mek.key.participant || from)
                const senderNumber = sender.split('@')[0]
                const pushname = mek.pushName || 'Sin Nombre'
                const isMe = mek.key.fromMe || sameJid(sender, botNumber2)
                const isOwner = ownerNumber.includes(senderNumber) || isMe

                /*
                 * A failed groupMetadata request used to return {}, then the
                 * following participant/admin access threw and aborted the
                 * entire handler before command dispatch. Keep safe defaults
                 * and allow ordinary group commands to continue.
                 */
                let groupMetadata = null
                let groupName = ''
                let participants = []
                let groupAdmins = []

                if (isGroup) {
                    try {
                        groupMetadata = await withTimeout(
                            conn.groupMetadata(from),
                            10000,
                            'Group metadata timed out',
                        )
                        groupName = groupMetadata?.subject || ''
                        participants = Array.isArray(groupMetadata?.participants)
                            ? groupMetadata.participants
                            : []
                        groupAdmins = await getGroupAdmins(participants)
                        if (!Array.isArray(groupAdmins)) groupAdmins = []
                    } catch (e) {
                        console.log('Group metadata error:', e.message)
                    }
                }

                const isBotAdmins = isGroup ? groupAdmins.some(admin => sameJid(admin, botNumber2)) : false
                const isAdmins = isGroup ? groupAdmins.some(admin => sameJid(admin, sender)) : false
                const isReact = Boolean(m?.message?.reactionMessage)
                const reply = (teks) => {
                    return conn.sendMessage(from, { text: teks, contextInfo: globalContextInfo }, { quoted: mek })
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
                    const trueFileName = attachExtension && type?.ext ? (filename + '.' + type.ext) : filename
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
                    if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
                    else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
                    copy.key.remoteJid = jid
                    copy.key.fromMe = sameJid(sender, conn.user.id)

                    return proto.WebMessageInfo.fromObject(copy)
                }

                //=====================================================
                conn.getFile = async (PATH, save) => {
                    try {
                        let res
                        let data = Buffer.isBuffer(PATH)
                            ? PATH
                            : /^data:.*?\/.*?;base64,/i.test(PATH)
                                ? safeBufferFrom(PATH.split`,`[1], 'base64')
                                : /^https?:\/\//.test(PATH)
                                    ? await (res = await getBuffer(PATH))
                                    : fs.existsSync(PATH)
                                        ? fs.readFileSync(PATH)
                                        : typeof PATH === 'string'
                                            ? PATH
                                            : Buffer.alloc(0)
                        let type = await FileType.fromBuffer(data) || {
                            mime: 'application/octet-stream',
                            ext: '.bin'
                        }
                        let filename = path.join(tempDir, new Date * 1 + '.' + String(type.ext).replace(/^\./, ''))
                        if (data && save) await fs.promises.writeFile(filename, data)
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

                //=====================================================
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
                            pathFile = await writeExif(media, { packname: config.packname, author: config.packname, categories: options.categories ? options.categories : [] })
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

                //=====================================================
                conn.parseMention = async (text) => {
                    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
                }

                //=====================================================
                conn.sendMedia = async (jid, mediaPath, fileName = '', caption = '', quoted = '', options = {}) => {
                    try {
                        let types = await conn.getFile(mediaPath, true)
                        let { mime, ext, res, data, filename } = types
                        if ((res && res.status !== 200) || (Buffer.isBuffer(data) && data.length <= 65536)) {
                            try { throw { json: JSON.parse(data.toString()) } } catch (e) { if (e.json) throw e.json }
                        }
                        let type = '',
                            mimetype = mime,
                            pathFile = filename
                        if (options.asDocument) type = 'document'
                        if (options.asSticker || /webp/.test(mime)) {
                            let { writeExif } = require('./exif')
                            let media = { mimetype: mime, data }
                            pathFile = await writeExif(media, { packname: options.packname ? options.packname : config.packname, author: options.author ? options.author : config.author, categories: options.categories ? options.categories : [] })
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

                //=====================================================
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

                //=====================================================
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

                //=====================================================
                conn.sendTextWithMentions = async (jid, text, quoted, options = {}) => conn.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), ...globalContextInfo }, ...options }, { quoted })

                //=====================================================
                conn.sendImage = async (jid, mediaPath, caption = '', quoted = '', options) => {
                    try {
                        let buffer = Buffer.isBuffer(mediaPath) ? mediaPath : /^data:.*?\/.*?;base64,/i.test(mediaPath) ? safeBufferFrom(mediaPath.split`,`[1], 'base64') : /^https?:\/\//.test(mediaPath) ? await (await getBuffer(mediaPath)) : fs.existsSync(mediaPath) ? fs.readFileSync(mediaPath) : Buffer.alloc(0)
                        return await conn.sendMessage(jid, { image: buffer, caption: caption, contextInfo: globalContextInfo, ...options }, { quoted })
                    } catch (e) {
                        console.log('sendImage error:', e.message);
                        return null;
                    }
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
                if (!isReact && senderNumber !== botNumber) {
                    if (config.AUTO_REACT === 'true') {
                        const reactions = ['😊', '👍', '😂', '💯', '🔥', '🙏', '🎉', '👏', '😎', '🤖'];
                        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
                        void Promise.resolve(m.react(randomReaction)).catch(e => console.log('Auto react error:', e.message));
                    }
                }

                if (!isReact && senderNumber !== botNumber) {
                    if (config.CUSTOM_REACT === 'true') {
                        const reactions = (config.CUSTOM_REACT_EMOJIS || '💝,💖,💗,❤️‍🔥,❤️‍🩹,❤️,🩷,🧡,💛,💚,💙,🩵,💜,🤎,🖤,🤍').split(',');
                        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)].trim();
                        void Promise.resolve(m.react(randomReaction)).catch(e => console.log('Custom react error:', e.message));
                    }
                }

                if (!isReact && senderNumber !== botNumber) {
                    if (config.HEART_REACT === 'true') {
                        void Promise.resolve(m.react('❤️')).catch(e => console.log('Heart react error:', e.message));
                    }
                }

                //==========WORKTYPE============
                if (!isOwner && config.MODE === "private") return
                if (!isOwner && isGroup && config.MODE === "inbox") return
                if (!isOwner && !isGroup && config.MODE === "groups") return

                const events = require('./command')
                const cmdName = isCmd ? body.slice(prefix.length).trim().split(/\s+/)[0].toLowerCase() : false;
                if (isCmd) {
                    const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
                    if (cmd) {
                        if (cmd.react) {
                            void conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } })
                                .catch(e => console.log('Command react error:', e.message));
                        }

                        try {
                            await Promise.resolve(cmd.function(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }));
                        } catch (e) {
                            console.error("[PLUGIN ERROR] " + e);
                        }
                    }
                }

                for (const eventCommand of events.commands || []) {
                    try {
                        if (body && eventCommand.on === "body") {
                            await Promise.resolve(eventCommand.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }))
                        } else if (mek.q && eventCommand.on === "text") {
                            await Promise.resolve(eventCommand.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }))
                        } else if (
                            (eventCommand.on === "image" || eventCommand.on === "photo") &&
                            mek.type === "imageMessage"
                        ) {
                            await Promise.resolve(eventCommand.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }))
                        } else if (
                            eventCommand.on === "sticker" &&
                            mek.type === "stickerMessage"
                        ) {
                            await Promise.resolve(eventCommand.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }))
                        }
                    } catch (e) {
                        console.error("[EVENT ERROR] " + e);
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

app.get("/health", (req, res) => {
    res.json({
        ok: true,
        whatsapp: isReconnecting ? "connecting" : "running"
    });
});

app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

setTimeout(() => {
    connectToWA()
}, 4000);
