const {
  cmd
} = require('../command');
const sleep = _0x28b89a => new Promise(_0x3ad2ff => setTimeout(_0x3ad2ff, _0x28b89a));
cmd({
  'pattern': 'removemembers',
  'alias': ["kickall", 'endgc', "endgroup"],
  'desc': "Remove all non-admin members from the group.",
  'react': '🎉',
  'category': "group",
  'filename': __filename
}, async (_0x541c7c, _0x28ecd0, _0x2ebb28, {
  from: _0x3ec016,
  groupMetadata: _0x561a47,
  groupAdmins: _0x4abe0f,
  isBotAdmins: _0x119769,
  senderNumber: _0x112bfc,
  reply: _0x1cd54a,
  isGroup: _0x2d9dc6
}) => {
  try {
    if (!_0x2d9dc6) {
      return _0x1cd54a("This command can only be used in groups.");
    }
    const _0x5ad0e2 = _0x541c7c.user.id.split(':')[0x0];
    if (_0x112bfc !== _0x5ad0e2) {
      return _0x1cd54a("【ＳＩＬＶＡ】💥ＳＰＡＲＫ💥【ＭＤ\n\n】Only the bot owner can use this command.");
    }
    if (!_0x119769) {
      return _0x1cd54a("【ＳＩＬＶＡ】💥ＳＰＡＲＫ💥【ＭＤ】\n\nI need to be an admin to execute this command.");
    }
    const _0x27054b = _0x561a47.participants;
    const _0x59ce1d = _0x27054b.filter(_0x31bd1b => !_0x4abe0f.includes(_0x31bd1b.id));
    if (_0x59ce1d.length === 0x0) {
      return _0x1cd54a("【ＳＩＬＶＡ】💥ＳＰＡＲＫ💥【ＭＤ】\n\nThere are no non-admin members to remove.");
    }
    _0x1cd54a("Starting to remove " + _0x59ce1d.length + " non-admin members...");
    for (let _0x58a736 of _0x59ce1d) {
      try {
        await _0x541c7c.groupParticipantsUpdate(_0x3ec016, [_0x58a736.id], 'remove');
        await sleep(0x7d0);
      } catch (_0x448767) {
        console.error("Failed to remove " + _0x58a736.id + ':', _0x448767);
      }
    }
    _0x1cd54a("【ＳＩＬＶＡ】💥ＳＰＡＲＫ💥【ＭＤ】\n\nSuccessfully removed all non-admin members from the group.");
  } catch (_0x2ffa0d) {
    console.error("Error removing non-admin users:", _0x2ffa0d);
    _0x1cd54a("An error occurred while trying to remove non-admin members. Please try again.");
  }
});
cmd({
  'pattern': "removeadmins",
  'alias': ["kickadmins", "kickall3", "deladmins"],
  'desc': "Remove all admin members from the group, excluding the bot and bot owner.",
  'react': '🎉',
  'category': "group",
  'filename': __filename
}, async (_0x2c9a95, _0x3d19b1, _0x5d9806, {
  from: _0x49bf85,
  isGroup: _0x437d8e,
  senderNumber: _0x39ac26,
  groupMetadata: _0x45af2,
  groupAdmins: _0x59d911,
  isBotAdmins: _0x25f378,
  reply: _0x454a95
}) => {
  try {
    if (!_0x437d8e) {
      return _0x454a95("【ＳＩＬＶＡ】💥ＳＰＡＲＫ💥【ＭＤ】\n\nThis command can only be used in groups.");
    }
    const _0x86850b = _0x2c9a95.user.id.split(':')[0x0];
    if (_0x39ac26 !== _0x86850b) {
      return _0x454a95("Only the bot owner can use this command.");
    }
    if (!_0x25f378) {
      return _0x454a95("I need to be an admin to execute this command.");
    }
    const _0x5251dc = _0x45af2.participants;
    const _0x3468fe = _0x5251dc.filter(_0x6832c1 => _0x59d911.includes(_0x6832c1.id) && _0x6832c1.id !== _0x2c9a95.user.id && _0x6832c1.id !== _0x86850b + "@s.whatsapp.net");
    if (_0x3468fe.length === 0x0) {
      return _0x454a95("There are no admin members to remove.");
    }
    _0x454a95("Starting to remove " + _0x3468fe.length + " admin members, excluding the bot and bot owner...");
    for (let _0x164699 of _0x3468fe) {
      try {
        await _0x2c9a95.groupParticipantsUpdate(_0x49bf85, [_0x164699.id], 'remove');
        await sleep(0x7d0);
      } catch (_0x1b4051) {
        console.error("Failed to remove " + _0x164699.id + ':', _0x1b4051);
      }
    }
    _0x454a95("Successfully removed all admin members from the group, excluding the bot and bot owner.");
  } catch (_0x2a5e6b) {
    console.error("Error removing admins:", _0x2a5e6b);
    _0x454a95("An error occurred while trying to remove admins. Please try again.");
  }
});
cmd({
  'pattern': "removeall2",
  'alias': ["kickall2", "endgc2", "endgroup2"],
  'desc': "Remove all members and admins from the group, excluding the bot and bot owner.",
  'react': '🎉',
  'category': "group",
  'filename': __filename
}, async (_0x58df9b, _0x205354, _0x4f7c7c, {
  from: _0xc8fca7,
  isGroup: _0x4daea3,
  senderNumber: _0x270b3f,
  groupMetadata: _0x5289f6,
  isBotAdmins: _0x1db97d,
  reply: _0x477905
}) => {
  try {
    if (!_0x4daea3) {
      return _0x477905("This command can only be used in groups.");
    }
    const _0x3fdab4 = _0x58df9b.user.id.split(':')[0x0];
    if (_0x270b3f !== _0x3fdab4) {
      return _0x477905("Only the bot owner can use this command.");
    }
    if (!_0x1db97d) {
      return _0x477905("【ＳＩＬＶＡ】💥ＳＰＡＲＫ💥【ＭＤ】\n\nI need to be an admin to execute this command.");
    }
    const _0x44e3d7 = _0x5289f6.participants;
    if (_0x44e3d7.length === 0x0) {
      return _0x477905("The group has no members to remove.");
    }
    const _0x94c1ea = _0x44e3d7.filter(_0x29a3c7 => _0x29a3c7.id !== _0x58df9b.user.id && _0x29a3c7.id !== _0x3fdab4 + "@s.whatsapp.net");
    if (_0x94c1ea.length === 0x0) {
      return _0x477905("No members to remove after excluding the bot and bot owner.");
    }
    _0x477905("Starting to remove " + _0x94c1ea.length + " members, excluding the bot and bot owner...");
    for (let _0x447569 of _0x94c1ea) {
      try {
        await _0x58df9b.groupParticipantsUpdate(_0xc8fca7, [_0x447569.id], "remove");
        await sleep(0x7d0);
      } catch (_0x2fc4ea) {
        console.error("Failed to remove " + _0x447569.id + ':', _0x2fc4ea);
      }
    }
    _0x477905("【ＳＩＬＶＡ】💥ＳＰＡＲＫ💥【ＭＤ】\n\nSuccessfully removed all members, excluding the bot and bot owner, from the group.");
  } catch (_0x191e55) {
    console.error("Error removing members:", _0x191e55);
    _0x477905("An error occurred while trying to remove members. Please try again.");
  }
});
