const {
  cmd
} = require("../command");
const fetch = require("node-fetch");
cmd({
  'pattern': 'gitclone',
  'alias': ["git"],
  'desc': "Download GitHub repository as a zip file.",
  'react': '📦',
  'category': "downloader",
  'filename': __filename
}, async (_0x359a4d, _0x5b481d, _0x310e0a, {
  from: _0x421a7d,
  quoted: _0x163171,
  args: _0x216653,
  reply: _0x11eb9d
}) => {
  if (!_0x216653[0x0]) {
    return _0x11eb9d("Where is the GitHub link?\n\nExample:\n.gitclone https://github.com/SilvaTechB/silva-spark-md");
  }
  if (!/^(https:\/\/)?github\.com\/.+/.test(_0x216653[0x0])) {
    return _0x11eb9d("⚠️ Invalid GitHub link.");
  }
  try {
    let _0xb5560f = /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/i;
    let [_0x460bcd, _0x5194b2, _0x16a926] = _0x216653[0x0].match(_0xb5560f) || [];
    if (!_0x5194b2 || !_0x16a926) {
      throw new Error("Invalid GitHub URL.");
    }
    let _0x936878 = "https://api.github.com/repos/" + _0x5194b2 + '/' + _0x16a926 + '/zipball';
    let _0xe6be44 = await fetch(_0x936878, {
      'method': "HEAD"
    });
    if (!_0xe6be44.ok) {
      throw new Error("Repository not found.");
    }
    let _0x49a379 = _0xe6be44.headers.get("content-disposition");
    let _0x481150 = _0x49a379 ? _0x49a379.match(/filename=(.*)/)[0x1] : _0x16a926 + ".zip";
    _0x11eb9d("*📥𝘚𝘪𝘭𝘷𝘢 𝘚𝘱𝘢𝘳𝘬 𝘔𝘋 DOWNLOADING REPOSITORY...*\n\n*REPOSITORY:* " + _0x5194b2 + '/' + _0x16a926 + "\n*FILENAME:* " + _0x481150 + "\n\n> *© 𝘚𝘪𝘭𝘷𝘢 𝘚𝘱𝘢𝘳𝘬 𝘔𝘋*");
    await _0x359a4d.sendMessage(_0x421a7d, {
      'document': {
        'url': _0x936878
      },
      'fileName': _0x481150 + ".zip",
      'mimetype': 'application/zip',
      'contextInfo': {
        'mentionedJid': [_0x5b481d.sender],
        'forwardingScore': 0x3e7,
        'isForwarded': true,
        'forwardedNewsletterMessageInfo': {
          'newsletterJid': "120363200367779016@newsletter",
          'newsletterName': "SILVA GITHUB CLONE💀",
          'serverMessageId': 0x8f
        }
      }
    }, {
      'quoted': _0x5b481d
    });
  } catch (_0x12ae9b) {
    console.error(_0x12ae9b);
    _0x11eb9d("❌ Failed to download the repository. Please try again later.");
  }
});
