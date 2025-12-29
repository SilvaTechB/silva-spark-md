const {
  cmd,
  commands
} = require("../command");
const {
  getBuffer,
  getGroupAdmins,
  getRandom,
  h2k,
  isUrl,
  Json,
  runtime,
  sleep,
  fetchJson
} = require('../lib/functions');
cmd({
  'pattern': "yts",
  'alias': ['ytsearch'],
  'use': ".yts jawad bahi",
  'react': '🎶',
  'desc': "Search and get details from youtube.",
  'category': 'search',
  'filename': __filename
}, async (_0x8bb7a2, _0x59b91a, _0x54b028, {
  from: _0x2c8a8a,
  l: _0x20f49c,
  quoted: _0x227a69,
  body: _0x3e4688,
  isCmd: _0x274fd7,
  umarmd: _0xf1ebe2,
  args: _0x1bbc32,
  q: _0x1711f7,
  isGroup: _0x2a64f7,
  sender: _0x170bd7,
  senderNumber: _0x37a8a8,
  botNumber2: _0x125009,
  botNumber: _0x27d020,
  pushname: _0x29b8f1,
  isMe: _0x4ebc14,
  isOwner: _0xff9e5a,
  groupMetadata: _0x2a783c,
  groupName: _0x438dbf,
  participants: _0xc08876,
  groupAdmins: _0x34bc3e,
  isBotAdmins: _0x30496e,
  isAdmins: _0x21b602,
  reply: _0x2758de
}) => {
  try {
    if (!_0x1711f7) {
      return _0x2758de("*Please give me words to search*");
    }
    try {
      let _0x2e5a42 = require('yt-search');
      var _0x569f7f = await _0x2e5a42(_0x1711f7);
    } catch (_0x5f5996) {
      _0x20f49c(_0x5f5996);
      return await _0x8bb7a2.sendMessage(_0x2c8a8a, {
        'text': "*Error !!*"
      }, {
        'quoted': _0x59b91a
      });
    }
    var _0x7ecaa0 = '';
    _0x569f7f.all.map(_0x48f334 => {
      _0x7ecaa0 += " *🖲️" + _0x48f334.title + "*\n🔗 " + _0x48f334.url + "\n\n";
    });
    await _0x8bb7a2.sendMessage(_0x2c8a8a, {
      'text': _0x7ecaa0
    }, {
      'quoted': _0x59b91a
    });
  } catch (_0x551e2c) {
    _0x20f49c(_0x551e2c);
    _0x2758de("*Error !!*");
  }
});
