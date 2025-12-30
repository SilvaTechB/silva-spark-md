# ⚡ Quick Start Guide - Silva Spark MD

> Get your bot running in 5 minutes!

---

## 🎯 What You Need

- ✅ A computer or VPS
- ✅ Node.js v20 or higher
- ✅ A WhatsApp account
- ✅ 10 minutes of your time

---

## 🚀 Option 1: Cloud Deployment (Easiest)

### Step 1: Get Session ID

1. Visit: https://silva-session-selector.vercel.app
2. Scan QR code with WhatsApp
3. Copy your `SESSION_ID` (format: `Silva~xxxxx`)

### Step 2: Deploy

**Choose your platform:**

| Platform | Click to Deploy |
|----------|----------------|
| **Heroku** | [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://spark-fork.vercel.app) |
| **Koyeb** | [![Deploy](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/services/deploy?type=git&repository=SilvaTechB/silva-spark-md&ports=3000) |
| **Railway** | [![Deploy](https://railway.app/button.svg)](https://railway.app/new) |

### Step 3: Configure

- Paste your `SESSION_ID`
- Set other options (optional)
- Click **Deploy**

### Step 4: Done! 🎉

Bot should be online in 2-3 minutes.

---

## 💻 Option 2: Local Setup (Full Control)

### Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/SilvaTechB/silva-spark-md.git
cd silva-spark-md

# Install dependencies
npm install
```

### Step 2: Configure

```bash
# Create config file
cp config.env.example config.env

# Edit config file
nano config.env
```

**Minimal config:**
```env
SESSION_ID=
PREFIX=.
MODE=public
```

### Step 3: Get Session ID

```bash
# Leave SESSION_ID empty in config.env
# Run the bot
node index.js

# Scan the QR code that appears
# Your session will be saved automatically
```

### Step 4: Start Bot

```bash
# Start with Node
node index.js

# Or with PM2 (recommended)
npm start
```

---

## ✅ Verify It's Working

### Check 1: Console Output

You should see:
```
✅ Session loaded successfully
Plugins installed successful ✅
Bot connected to whatsapp ✅
```

### Check 2: Send Test Command

Send in WhatsApp:
```
.alive
```

You should receive a response!

### Check 3: Try Menu

Send:
```
.menu
```

You should see the command list!

---

## 🎛️ Basic Configuration

### Essential Settings

```env
# Your Session (REQUIRED)
SESSION_ID=Silva~your_session_here

# Command Prefix (default: .)
PREFIX=.

# Bot Mode (public, private, inbox, groups)
MODE=public

# Owner Number (your WhatsApp number)
OWNER_NUMBER=1234567890
```

### Popular Features

```env
# Anti-Link (block group links)
ANTI_LINK=true

# Anti-Delete (recover deleted messages)
ANTI_DELETE=true

# Auto Status View
AUTO_STATUS_SEEN=true

# Auto Status React
AUTO_STATUS_REACT=true

# Always Online
ALWAYS_ONLINE=true
```

### Turn OFF Annoying Features

```env
# Disable auto reactions
AUTO_REACT=false

# Disable auto read
READ_MESSAGE=false

# Disable auto reply
AUTO_REPLY=false
```

---

## 📱 First Commands to Try

### Test Basic Functions
```
.alive     - Check if bot is online
.ping      - Check response time
.menu      - See all commands
```

### Download Something
```
.song Shape of You
.video funny cats
.tiktok <tiktok-url>
```

### Create Stickers
```
Send an image → Reply with: .sticker
Send a video → Reply with: .sticker
```

### Group Admin Commands
```
.antilink on    - Enable link blocking
.kick @user     - Remove member
.promote @user  - Make admin
```

---

## 🐛 Common Issues & Quick Fixes

### ❌ "Cannot decrypt message"

**Fix:**
```bash
rm -rf sessions/
node index.js
# Scan new QR code
```

### ❌ Commands not working

**Check:**
1. Is prefix correct? (default: `.`)
2. Is MODE set correctly?
3. Did bot send welcome message?

**Fix:**
```bash
# Check config
cat config.env | grep PREFIX
cat config.env | grep MODE

# Restart bot
pm2 restart silva-spark-md
```

### ❌ Anti-link not working

**Requirements:**
- Bot must be GROUP ADMIN
- User must NOT be admin
- ANTI_LINK=true in config

**Fix:**
```bash
# Make bot admin in group
# Check config
cat config.env | grep ANTI_LINK

# Test with: .antilink
```

### ❌ Bot keeps disconnecting

**Fix for Heroku:**
```bash
# Upgrade dyno type (no sleep)
heroku ps:type hobby
```

**Fix for VPS:**
```bash
# Use PM2
npm install -g pm2
pm2 start index.js --name silva-spark
pm2 startup
pm2 save
```

---

## 📊 Monitor Your Bot

### Using PM2 (Local/VPS)

```bash
# View status
pm2 status

# View logs
pm2 logs silva-spark-md

# Restart
pm2 restart silva-spark-md

# Stop
pm2 stop silva-spark-md
```

### Using Heroku

```bash
# View logs
heroku logs --tail

# Restart
heroku restart

# Check status
heroku ps
```

---

## 🎨 Customize Your Bot

### Change Bot Name

```env
BOT_NAME=My Awesome Bot
```

### Change Command Prefix

```env
PREFIX=!
# Now use: !menu, !alive, etc
```

### Enable Custom Reactions

```env
CUSTOM_REACT=true
CUSTOM_REACT_EMOJIS=🔥,💯,😎,🎉,✨
```

### Set Auto Status Message

```env
AUTO_STATUS_REPLY=true
AUTO_STATUS__MSG=Thanks for the status! 🎉
```

---

## 🔄 Update Your Bot

### Local Installation

```bash
# Pull latest changes
git pull origin main

# Reinstall dependencies
npm install

# Restart bot
pm2 restart silva-spark-md
```

### Heroku

```bash
# Pull latest changes
git pull origin main

# Deploy to Heroku
git push heroku main
```

---

## 📚 Next Steps

### Learn More

- 📖 [Full Documentation](README.md)
- 💻 [All Commands](COMMANDS.md)
- 🤝 [Contributing Guide](CONTRIBUTING.md)
- 📝 [Changelog](CHANGELOG.md)

### Join Community

- 💬 [WhatsApp Channel](https://whatsapp.com/channel/0029VaAkETLLY6d8qhLmZt2v)
- 📱 [Instagram](https://instagram.com/_its.silva)
- 🐦 [Twitter](https://x.com/silva_african)

### Get Help

- 🐛 [Report Bugs](https://github.com/SilvaTechB/silva-spark-md/issues)
- 💡 [Request Features](https://github.com/SilvaTechB/silva-spark-md/discussions)
- ⭐ [Star on GitHub](https://github.com/SilvaTechB/silva-spark-md)

---

## 🎯 Pro Tips

### Performance

```bash
# Use PM2 for auto-restart
pm2 start index.js --name silva-spark --max-memory-restart 500M

# Monitor resources
pm2 monit
```

### Security

```env
# Never share your SESSION_ID
# Keep OWNER_NUMBER private
# Use environment variables for sensitive data
```

### Best Practices

```yaml
✅ DO:
  - Test commands before using in groups
  - Keep bot updated regularly
  - Monitor logs for errors
  - Make bot admin in groups (if using anti features)

❌ DON'T:
  - Share your SESSION_ID
  - Spam commands
  - Use for illegal activities
  - Forget to credit if you modify
```

---

## 💡 Quick Reference Card

```
┌─────────────────────────────────────┐
│   SILVA SPARK MD - QUICK REFERENCE  │
├─────────────────────────────────────┤
│                                     │
│  Start: node index.js               │
│  PM2: npm start                     │
│  Test: .alive                       │
│                                     │
│  Config: config.env                 │
│  Logs: pm2 logs silva-spark-md      │
│  Session: sessions/creds.json       │
│                                     │
│  Help: .menu                        │
│  Update: git pull && npm install    │
│                                     │
│  Support:                           │
│  whatsapp.com/channel/              │
│  0029VaAkETLLY6d8qhLmZt2v          │
│                                     │
└─────────────────────────────────────┘
```

---

<div align="center">

## 🎉 You're All Set!

Your Silva Spark MD bot is ready to rock! 🚀

**Need help?** Join our [WhatsApp Channel](https://whatsapp.com/channel/0029VaAkETLLY6d8qhLmZt2v)

**Enjoying it?** Give us a ⭐ on [GitHub](https://github.com/SilvaTechB/silva-spark-md)

---

**Made with 💜 by Silva Tech Inc**

</div>
