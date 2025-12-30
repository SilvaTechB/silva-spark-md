# 🤝 Contributing to Silva Spark MD

First off, thank you for considering contributing to Silva Spark MD! 💜

It's people like you that make Silva Spark MD such a great tool. We welcome contributions from everyone, whether you're fixing a typo or adding a major feature.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
- [Development Setup](#-development-setup)
- [Pull Request Process](#-pull-request-process)
- [Coding Standards](#-coding-standards)
- [Commit Guidelines](#-commit-guidelines)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming environment. By participating, you are expected to uphold this code.

### Our Pledge

- **Be Respectful:** Treat everyone with respect
- **Be Constructive:** Provide helpful feedback
- **Be Patient:** Remember everyone is learning
- **Be Inclusive:** Welcome all contributors

---

## 🎯 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Execute command '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Ubuntu 20.04]
- Node.js Version: [e.g. 20.11.0]
- Bot Version: [e.g. 2.0.1]

**Additional context**
Any other context about the problem.
```

### 💡 Suggesting Features

Feature requests are welcome! Before creating a feature request:

1. **Check existing requests** to avoid duplicates
2. **Be specific** about what you want
3. **Explain why** it would be useful

**Feature Request Template:**

```markdown
**Feature Description**
Clear description of the feature.

**Use Case**
Why would this feature be useful?

**Proposed Solution**
How do you think it should work?

**Alternatives**
Other solutions you've considered.

**Additional context**
Screenshots, mockups, examples, etc.
```

### 🔧 Contributing Code

Want to fix a bug or add a feature? Great! Here's how:

1. **Fork the repository**
2. **Create a branch** for your feature
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

---

## 💻 Development Setup

### Prerequisites

- Node.js v20.x or higher
- Git
- Text editor (VS Code recommended)
- WhatsApp account for testing

### Setup Steps

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/silva-spark-md.git
cd silva-spark-md

# 2. Install dependencies
npm install

# 3. Create a branch for your changes
git checkout -b feature/your-feature-name

# 4. Configure environment
cp config.env.example config.env
# Edit config.env with your test credentials

# 5. Start the bot
node index.js
```

### Project Structure

```
silva-spark-md/
├── index.js              # Main bot file
├── config.js             # Configuration handler
├── command.js            # Command handler
├── plugins/              # Plugin files
│   ├── anti-system.js    # Anti-link, anti-bad word
│   ├── download.js       # Download commands
│   └── ...               # Other plugins
├── lib/                  # Helper libraries
│   ├── functions.js      # Utility functions
│   └── msg.js            # Message handler
└── sessions/             # Session storage (gitignored)
```

### Running Tests

```bash
# Test bot startup
node index.js

# Test specific command
# Send command in WhatsApp test chat

# Check logs
tail -f logs/bot.log
```

---

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Comments added for complex code
- [ ] Self-review completed
- [ ] Changes tested locally
- [ ] No console errors
- [ ] Documentation updated (if needed)

### PR Title Format

```
<type>(<scope>): <subject>

Examples:
feat(download): add Instagram reel support
fix(antilink): resolve detection issue
docs(readme): update installation steps
style(plugins): improve code formatting
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, etc)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Commented complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
```

### Review Process

1. **Automatic Checks:** CI/CD will run
2. **Code Review:** Maintainers will review
3. **Changes Requested:** Address feedback
4. **Approval:** Once approved, will be merged
5. **Merge:** Your contribution is live! 🎉

---

## 📏 Coding Standards

### JavaScript Style Guide

#### Naming Conventions

```javascript
// Variables and functions: camelCase
const userName = "Silva";
function getUserName() { }

// Constants: UPPER_SNAKE_CASE
const API_KEY = "xxx";
const MAX_RETRIES = 3;

// Classes: PascalCase
class UserManager { }

// Private: prefix with _
const _privateVar = "private";
```

#### Code Formatting

```javascript
// Use semicolons
const x = 5;

// Use === instead of ==
if (value === true) { }

// Use const by default, let when needed
const config = {};
let counter = 0;

// Arrow functions for callbacks
array.map(item => item.name);

// Template literals for strings
const message = `Hello ${name}!`;

// Destructuring when possible
const { name, age } = user;

// Proper error handling
try {
    await someAsyncFunction();
} catch (error) {
    console.error('Error:', error);
}
```

#### Comments

```javascript
// Single-line comments for brief explanations
const timeout = 5000; // 5 seconds

/**
 * Multi-line comments for functions
 * @param {string} message - The message to send
 * @param {string} to - Recipient JID
 * @returns {Promise<void>}
 */
async function sendMessage(message, to) {
    // Implementation
}
```

### Plugin Development

```javascript
const { cmd } = require('../command');

cmd({
    pattern: "commandname",
    alias: ["alt1", "alt2"],
    desc: "Brief description",
    category: "category",
    react: "🔥",
    filename: __filename
}, async (conn, mek, m, {
    from, body, args, reply
}) => {
    try {
        // Your code here
        reply("Response");
    } catch (error) {
        console.error('[PLUGIN ERROR]:', error);
        reply("❌ An error occurred");
    }
});
```

---

## 📝 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Examples

```bash
# Feature
git commit -m "feat(download): add TikTok video support"

# Bug fix
git commit -m "fix(antilink): correct URL detection regex"

# Documentation
git commit -m "docs(readme): add installation troubleshooting"

# Multiple changes
git commit -m "feat(media): add image enhancement
- Add blur effect
- Add sharpen effect
- Add brightness adjustment"
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Tests
- `chore`: Maintenance

---

## 🎨 Adding a New Plugin

### Plugin Template

```javascript
const { cmd } = require('../command');
const config = require('../config');

// ==============================
// 🎯 YOUR PLUGIN NAME
// ==============================

cmd({
    pattern: "yourcommand",
    alias: ["yc", "cmd"],
    desc: "Description of what your command does",
    category: "general", // general, download, media, group, owner
    react: "✨",
    filename: __filename
}, async (conn, mek, m, {
    from,
    body,
    args,
    q,
    reply,
    isGroup,
    sender,
    isOwner
}) => {
    try {
        // Input validation
        if (!q) {
            return reply("❌ Please provide input!\n\n*Usage:* .yourcommand <input>");
        }

        // Your logic here
        const result = await processInput(q);

        // Send response
        reply(`✅ Success!\n\n${result}`);

    } catch (error) {
        console.error('[YOUR PLUGIN ERROR]:', error);
        reply("❌ An error occurred while processing your request.");
    }
});

// Helper functions
async function processInput(input) {
    // Your processing logic
    return "Processed result";
}
```

### Plugin Checklist

- [ ] Clear command pattern
- [ ] Helpful description
- [ ] Proper category
- [ ] Input validation
- [ ] Error handling
- [ ] User-friendly responses
- [ ] Code comments
- [ ] Tested thoroughly

---

## 🧪 Testing Your Changes

### Manual Testing

1. **Start bot locally**
   ```bash
   node index.js
   ```

2. **Test your command**
   - Send command in WhatsApp
   - Try with different inputs
   - Test error cases
   - Test edge cases

3. **Check logs**
   - No errors in console
   - Expected output

### Test Scenarios

- ✅ Valid input
- ✅ Invalid input
- ✅ Missing parameters
- ✅ Long input
- ✅ Special characters
- ✅ Multiple users
- ✅ Group vs private chat

---

## 🆘 Getting Help

### Resources

- **Documentation:** Check our [Wiki](https://github.com/SilvaTechB/silva-spark-md/wiki)
- **Baileys Docs:** [WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys)
- **Community:** [WhatsApp Channel](https://whatsapp.com/channel/0029VaAkETLLY6d8qhLmZt2v)

### Contact

- **Issues:** [GitHub Issues](https://github.com/SilvaTechB/silva-spark-md/issues)
- **Discussions:** [GitHub Discussions](https://github.com/SilvaTechB/silva-spark-md/discussions)
- **Email:** Contact via GitHub profile

---

## 🎉 Recognition

Contributors will be:

- ⭐ Listed in [CONTRIBUTORS.md](CONTRIBUTORS.md)
- 💜 Mentioned in release notes
- 🏆 Given contributor badge
- 🙏 Forever appreciated

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

<div align="center">

**Thank you for contributing! 💜**

Every contribution, no matter how small, makes a difference.

[Back to Main README](README.md)

</div>
