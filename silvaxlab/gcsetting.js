const {
  cmd
} = require('../command');
cmd({
  'pattern': "leave",
  'alias': ['left', 'l'],
  'react': '🔐',
  'desc': "Remove all members with a specific country code from the group",
  'category': 'owner',
  'filename': __filename
}, async (_0x403693, _0x1fe1a1, _0xe5d90b, {
  from: _0x1ac45c,
  quoted: _0x1d832e,
  body: _0x2e22cd,
  isCmd: _0x3e35c1,
  command: _0x2ba3e8,
  args: _0x400b8c,
  q: _0x473315,
  isGroup: _0x51c21a,
  senderNumber: _0x5bd5ac,
  reply: _0x284a7b
}) => {
  try {
    if (!_0x51c21a) {
      return _0x284a7b("*🚫 This command can only be used in groups.*");
    }
    const _0x3f975e = _0x403693.user.id.split(':')[0x0];
    if (_0x5bd5ac !== _0x3f975e) {
      return _0x284a7b("> *🚫 Only the bot owner can use this command.*");
    }
    const _0x32c8ad = _0x400b8c[0x0];
    if (!_0x32c8ad) {
      return _0x284a7b("Please specify the country code (e.g., +92 or +91).");
    }
    const _0x239d3d = await _0x403693.groupMetadata(_0x1ac45c);
    const _0x1bb4c9 = _0x239d3d.participants;
    const _0x1f9bc8 = _0x1bb4c9.filter(_0x22331a => _0x22331a.number && _0x22331a.number.startsWith(_0x32c8ad));
    if (_0x1f9bc8.length === 0x0) {
      return _0x284a7b("No members found with country code " + _0x32c8ad + '.');
    }
    for (let _0x298c47 of _0x1f9bc8) {
      await _0x403693.groupRemove(_0x1ac45c, [_0x298c47.jid]);
    }
    _0x284a7b("Removed all members with country code " + _0x32c8ad + " from the group.");
  } catch (_0x1f5ab4) {
    console.error(_0x1f5ab4);
    _0x284a7b("❌ Error: " + _0x1f5ab4);
  }
});
