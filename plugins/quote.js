const axios = require("axios");
const {
  cmd
} = require("../command");
cmd({
  'pattern': "quote",
  'desc': "Get a random inspiring quote.",
  'category': "fun",
  'react': '💬',
  'filename': __filename
}, async (_0x237929, _0x10ef1c, _0x304915, {
  from: _0x24aa1d,
  reply: _0x31a8bd
}) => {
  try {
    const _0x33914b = await axios.get("https://api.quotable.io/random");
    const _0x26063f = _0x33914b.data;
    const _0x25a0d1 = "\n💬 \"" + _0x26063f.content + "\"\n- " + _0x26063f.author + "\n> *QUOTES BY silva spark*\n        ";
    return _0x31a8bd(_0x25a0d1);
  } catch (_0x50410a) {
    console.error("Error fetching quote:", _0x50410a);
    _0x31a8bd("aby coding ma koi error hai fix kr");
  }
});
