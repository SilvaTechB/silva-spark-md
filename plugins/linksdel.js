const {
  cmd
} = require('../command');
const config = require('../config');
const linkPatterns = [/https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi, /^https?:\/\/(www\.)?whatsapp\.com\/channel\/([a-zA-Z0-9_-]+)$/, /wa\.me\/\S+/gi, /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi, /https?:\/\/(?:www\.)?youtube\.com\/\S+/gi, /https?:\/\/youtu\.be\/\S+/gi, /https?:\/\/(?:www\.)?facebook\.com\/\S+/gi, /https?:\/\/fb\.me\/\S+/gi, /https?:\/\/(?:www\.)?instagram\.com\/\S+/gi, /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi, /https?:\/\/(?:www\.)?tiktok\.com\/\S+/gi, /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi, /https?:\/\/(?:www\.)?snapchat\.com\/\S+/gi, /https?:\/\/(?:www\.)?pinterest\.com\/\S+/gi, /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi, /https?:\/\/ngl\/\S+/gi, /https?:\/\/(?:www\.)?discord\.com\/\S+/gi, /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi, /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi, /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi, /https?:\/\/(?:www\.)?medium\.com\/\S+/gi];
cmd({
  'on': 'body'
}, async (_0x3d156a, _0x48fdd7, _0xad4cb9, {
  from: _0x88cc2a,
  body: _0x4e3943,
  sender: _0x19c980,
  isGroup: _0x272e89,
  isAdmins: _0x1f1aa5,
  isBotAdmins: _0xece72d
}) => {
  try {
    if (!_0x272e89 || _0x1f1aa5 || !_0xece72d) {
      return;
    }
    const _0x1f0910 = linkPatterns.some(_0x962f67 => _0x962f67.test(_0x4e3943));
    if (_0x1f0910 && config.DELETE_LINKS === 'true') {
      await _0x3d156a.sendMessage(_0x88cc2a, {
        'delete': _0x48fdd7.key
      }, {
        'quoted': _0x48fdd7
      });
    }
  } catch (_0x478f90) {
    console.error(_0x478f90);
  }
});
