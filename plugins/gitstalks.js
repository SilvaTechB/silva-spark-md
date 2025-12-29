const fetch = require("node-fetch");
const {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  sleep,
  fetchJson
} = require("../lib/functions");
const {
  cmd
} = require("../command");
cmd({
  'pattern': "getpair",
  'alias': "pair",
  'desc': "Get a pairing code for a phone number",
  'category': "main",
  'filename': __filename
}, async (_0x3f368b, _0x1c1435, _0x2fe294, {
  reply: _0x393f08,
  body: _0x4cbc9c,
  isGroup: _0x586b42
}) => {
  try {
    await _0x3f368b.sendMessage(_0x2fe294.key.remoteJid || _0x2fe294.from, {
      'react': {
        'text': '⌛',
        'key': _0x2fe294.key
      }
    });
    if (_0x586b42) {
      return _0x3f368b.sendMessage(_0x2fe294.key.remoteJid || _0x2fe294.from, {
        'text': "*❌ Getting a pairing code is not allowed in groups!*\n\nPlease use this command in my inbox to get your pairing code."
      }, {
        'quoted': _0x2fe294
      });
    }
    const _0x3b2587 = _0x4cbc9c.split(" ")[0x1];
    if (!_0x3b2587 || !/^\d{10,15}$/.test(_0x3b2587)) {
      return _0x393f08("*❌ Invalid phone number format*.\n\nPlease enter a valid number with country code (.getpair 254000000000).");
    }
    await _0x3f368b.sendMessage(_0x2fe294.key.remoteJid || _0x2fe294.from, {
      'react': {
        'text': '⏳',
        'key': _0x2fe294.key
      }
    });
    _0x393f08("Processing your request. Please wait...");
    const _0x13d51a = await fetch("https://session-id.silvatechinc.my.id/pair?phone=" + encodeURIComponent(_0x3b2587));
    const _0x2e869c = await _0x13d51a.json();
    if (_0x2e869c.code) {
      const _0x25f740 = _0x2e869c.code;
      const _0xeea95a = "*⚡Pairing Code For silva spark 🗿*\n\n🪀 notification has been sent to your WhatsApp. Please check your phone and copy this code to pair it and get your *Ｓｉｌｖａ Ｓｐａｒｋ ＭＤ* session id.\n\n*🔢 Pairing Code* : *" + _0x25f740 + "*\n\n> *_Copy it from below message 👇🏻_*";
      try {
        await _0x3f368b.sendMessage(_0x2fe294.key.remoteJid || _0x2fe294.from, {
          'image': {
            'url': "https://i.imgur.com/PEZ5QL2.jpeg"
          },
          'caption': _0xeea95a
        }, {
          'quoted': _0x2fe294
        });
      } catch (_0x3ddd1f) {
        console.error("Error sending pairing code message with image:", _0x3ddd1f);
        _0x393f08("⚠️ Error sending pairing code message with image. Please try again.");
      }
      await _0x3f368b.sendMessage(_0x2fe294.key.remoteJid || _0x2fe294.from, {
        'text': _0x25f740
      }, {
        'quoted': _0x2fe294
      });
      await _0x3f368b.sendMessage(_0x2fe294.key.remoteJid || _0x2fe294.from, {
        'react': {
          'text': '⤵️',
          'key': _0x2fe294.key
        }
      });
    } else if (_0x2e869c.error) {
      _0x393f08("❌ Error: " + _0x2e869c.error);
    } else {
      _0x393f08("❌ Failed to retrieve pairing code. Please try again later.");
    }
  } catch (_0x43d09a) {
    console.error("Error processing pair command:", _0x43d09a);
    _0x393f08("❌ An error occurred: " + _0x43d09a.message);
  }
});
cmd({
  'pattern': "pair2",
  'alias': ['getpair2', "clonebot"],
  'react': '🎉',
  'desc': "Pairing code",
  'category': "download",
  'use': ".pair +254700143167",
  'filename': __filename
}, async (_0x164b72, _0x230a02, _0x1c5313, {
  from: _0x451058,
  prefix: _0x363a9d,
  quoted: _0x43e02b,
  q: _0x4de0bb,
  reply: _0x50e2bb
}) => {
  try {
    const _0x566978 = _0xf64dd8 => new Promise(_0x1495bd => setTimeout(_0x1495bd, _0xf64dd8));
    if (!_0x4de0bb) {
      return await _0x50e2bb("*Example -* .pair 254700143167");
    }
    const _0x5aa4f0 = require('node-fetch');
    const _0x3a87c7 = await _0x5aa4f0('https://session-id.silvatechinc.my.id/pair?phone=' + _0x4de0bb);
    const _0x15aa92 = await _0x3a87c7.json();
    if (!_0x15aa92 || !_0x15aa92.code) {
      return await _0x50e2bb("Failed to retrieve pairing code. Please check the phone number and try again.");
    }
    const _0x27dff2 = _0x15aa92.code;
    await _0x50e2bb("> *Ｓｉｌｖａ Ｓｐａｒｋ ＭＤ PAIR COMPLETED*\n\n*Your pairing code is:* " + _0x27dff2);
    await _0x566978(0x7d0);
    await _0x50e2bb('' + _0x27dff2);
  } catch (_0x53bf58) {
    console.error(_0x53bf58);
    await _0x50e2bb("An error occurred. Please try again later.");
  }
});
