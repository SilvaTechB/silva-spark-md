const crypto = require("crypto");
const {
  cmd
} = require("../command");
cmd({
  'pattern': "gpass",
  'desc': "Generate a strong password.",
  'category': "other",
  'react': '🔐',
  'filename': __filename
}, async (_0x1f40d4, _0x2b6900, _0x2e4aeb, {
  from: _0x329458,
  quoted: _0x395d6a,
  body: _0x40458f,
  isCmd: _0x214376,
  command: _0x502a1e,
  args: _0x982de,
  q: _0x124c0e,
  isGroup: _0x21418c,
  sender: _0x140496,
  senderNumber: _0xaf3ea1,
  botNumber2: _0x581460,
  botNumber: _0x1c011c,
  pushname: _0xde7eef,
  isMe: _0x562b47,
  isOwner: _0x4d7c68,
  groupMetadata: _0xf724fb,
  groupName: _0x4c678f,
  participants: _0x3e2c97,
  groupAdmins: _0x17576f,
  isBotAdmins: _0x176f78,
  isAdmins: _0x194d52,
  reply: _0x1bb557
}) => {
  try {
    const _0x1fe8bf = _0x982de[0x0] ? parseInt(_0x982de[0x0]) : 0xc;
    if (isNaN(_0x1fe8bf) || _0x1fe8bf < 0x8) {
      return _0x1bb557("Please provide a valid length for the password (Minimum 08 Characters💦).");
    }
    const _0x571dd4 = _0xf0eba7 => {
      let _0x56fb57 = '';
      for (let _0x3ea116 = 0x0; _0x3ea116 < _0xf0eba7; _0x3ea116++) {
        const _0x119792 = crypto.randomInt(0x0, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?".length);
        _0x56fb57 += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?'[_0x119792];
      }
      return _0x56fb57;
    };
    const _0x51f475 = _0x571dd4(_0x1fe8bf);
    await _0x1f40d4.sendMessage(_0x329458, {
      'text': "🔐 *Your Strong Password* 🔐\n\nPlease find your generated password below:\n\n *𝒮𝒾𝓁𝓋𝒶 𝒮𝓅𝒶𝓇𝓀 𝑀𝒟*"
    }, {
      'quoted': _0x2b6900
    });
    await _0x1f40d4.sendMessage(_0x329458, {
      'text': _0x51f475
    }, {
      'quoted': _0x2b6900
    });
  } catch (_0x1ad7bb) {
    console.log(_0x1ad7bb);
    _0x1bb557("❌𝒮𝒾𝓁𝓋𝒶 𝒮𝓅𝒶𝓇𝓀 𝑀𝒟 Error generating password🤕: " + _0x1ad7bb.message);
  }
});
