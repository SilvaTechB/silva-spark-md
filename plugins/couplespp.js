const {
  cmd,
  commands
} = require('../command');
const axios = require('axios');
cmd({
  'pattern': "couplepp",
  'alias': ["couple", "cpp"],
  'react': '💑',
  'desc': "Get a male and female couple profile picture.",
  'category': "image",
  'use': ".couplepp",
  'filename': __filename
}, async (_0x552520, _0x51cf3f, _0x29f4cb, {
  from: _0x556c44,
  args: _0x2e3a6d,
  reply: _0x30d3fc
}) => {
  try {
    _0x30d3fc("*SILVA SPARK IS 💑 Fetching couple profile pictures...*");
    const _0x173643 = await axios.get("https://api.davidcyriltech.my.id/couplepp");
    if (!_0x173643.data || !_0x173643.data.success) {
      return _0x30d3fc("❌ Failed to fetch couple profile pictures. Please try again later.");
    }
    const _0x5d4b91 = _0x173643.data.male;
    const _0x5a1e4a = _0x173643.data.female;
    if (_0x5d4b91) {
      await _0x552520.sendMessage(_0x556c44, {
        'image': {
          'url': _0x5d4b91
        },
        'caption': "SILVA SPARK SUGGESTS: 👨 Male Couple Profile Picture"
      }, {
        'quoted': _0x51cf3f
      });
    }
    if (_0x5a1e4a) {
      await _0x552520.sendMessage(_0x556c44, {
        'image': {
          'url': _0x5a1e4a
        },
        'caption': "SILVA SPARK SUGGESTS: 👩 Female Couple Profile Picture"
      }, {
        'quoted': _0x51cf3f
      });
    }
  } catch (_0x1dc6a7) {
    console.error(_0x1dc6a7);
    _0x30d3fc("❌ An error occurred while fetching the couple profile pictures.");
  }
});
