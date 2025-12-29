const config = require("../config");
const {
  cmd,
  commands
} = require("../command");
cmd({
  'pattern': "opentime",
  'react': '🔖',
  'desc': "To open group to a time",
  'category': "group",
  'use': ".opentime",
  'filename': __filename
}, async (_0x34b3eb, _0x420019, _0x39b627, {
  from: _0x1979f2,
  prefix: _0x7a8f6f,
  l: _0x25c44a,
  quoted: _0x379179,
  body: _0x681d99,
  isCmd: _0x4f96ba,
  command: _0x3c87cf,
  args: _0x3aae58,
  q: _0x29755d,
  isGroup: _0x18986c,
  sender: _0x1eeef2,
  senderNumber: _0x5e7c65,
  botNumber2: _0x5dc97f,
  botNumber: _0x7cbf18,
  pushname: _0x10e0d4,
  isMe: _0x40fd80,
  isOwner: _0x34432b,
  groupMetadata: _0x53257c,
  groupName: _0x582d96,
  participants: _0x5b6051,
  groupAdmins: _0x507027,
  isBotAdmins: _0x480a94,
  isAdmins: _0x186a74,
  reply: _0x515443
}) => {
  try {
    if (!_0x18986c) {
      return _0x515443(ONLGROUP);
    }
    if (!_0x186a74) {
      return _0x515443(ADMIN);
    }
    if (_0x3aae58[0x1] == "second") {
      var _0x57d309 = _0x3aae58[0x0] * "1000";
    } else {
      if (_0x3aae58[0x1] == "minute") {
        var _0x57d309 = _0x3aae58[0x0] * "60000";
      } else {
        if (_0x3aae58[0x1] == 'hour') {
          var _0x57d309 = _0x3aae58[0x0] * "3600000";
        } else {
          if (_0x3aae58[0x1] == 'day') {
            var _0x57d309 = _0x3aae58[0x0] * "86400000";
          } else {
            return _0x515443("*select:*\nsecond\nminute\nhour\n\n*example*\n10 second");
          }
        }
      }
    }
    _0x515443("Open time " + _0x29755d + " starting from now");
    setTimeout(() => {
      _0x34b3eb.groupSettingUpdate(_0x1979f2, "not_announcement");
      _0x515443("> *NOW GROUP IS OPENED BY SPARK DE SILVA BOT*");
    }, _0x57d309);
    await _0x34b3eb.sendMessage(_0x1979f2, {
      'react': {
        'text': '✅',
        'key': _0x420019.key
      }
    });
  } catch (_0x36d0c6) {
    _0x515443("*Error !!*");
    _0x25c44a(_0x36d0c6);
  }
});
cmd({
  'pattern': "closetime",
  'react': '🔖',
  'desc': "To close group to a time",
  'category': "group",
  'use': ".closstime",
  'filename': __filename
}, async (_0x33bbc7, _0x1f2130, _0x578b2f, {
  from: _0x152d4d,
  prefix: _0xb42f24,
  l: _0xbe8dbc,
  quoted: _0x59c39b,
  body: _0x40ea43,
  isCmd: _0x2826d4,
  command: _0x25218c,
  args: _0x5b0123,
  q: _0x490959,
  isGroup: _0x369c33,
  sender: _0x536754,
  senderNumber: _0x226ae6,
  botNumber2: _0x262160,
  botNumber: _0x5de73e,
  pushname: _0x25e051,
  isMe: _0x5a41d6,
  isOwner: _0x567b92,
  groupMetadata: _0x3a3520,
  groupName: _0xdac3e3,
  participants: _0x29c2b6,
  groupAdmins: _0x1d43ad,
  isBotAdmins: _0x526454,
  isAdmins: _0x526c9a,
  reply: _0x5c514e
}) => {
  try {
    if (!_0x369c33) {
      return _0x5c514e(ONLGROUP);
    }
    if (!_0x526c9a) {
      return _0x5c514e(ADMIN);
    }
    if (_0x5b0123[0x1] == 'second') {
      var _0x4b2fe4 = _0x5b0123[0x0] * "1000";
    } else {
      if (_0x5b0123[0x1] == "minute") {
        var _0x4b2fe4 = _0x5b0123[0x0] * "60000";
      } else {
        if (_0x5b0123[0x1] == "hour") {
          var _0x4b2fe4 = _0x5b0123[0x0] * "3600000";
        } else {
          if (_0x5b0123[0x1] == "day") {
            var _0x4b2fe4 = _0x5b0123[0x0] * "86400000";
          } else {
            return _0x5c514e("*select:*\nsecond\nminute\nhour\n\n*Example*\n10 second");
          }
        }
      }
    }
    _0x5c514e("Close time " + _0x490959 + " starting from now");
    setTimeout(() => {
      _0x33bbc7.groupSettingUpdate(_0x152d4d, "announcement");
      _0x5c514e("> *NOW GROUP CLOSED BY SILVA SPARK MD*");
    }, _0x4b2fe4);
    await _0x33bbc7.sendMessage(_0x152d4d, {
      'react': {
        'text': '✅',
        'key': _0x1f2130.key
      }
    });
  } catch (_0x4094cc) {
    _0x5c514e("*Error !!*");
    _0xbe8dbc(_0x4094cc);
  }
});
cmd({
  'pattern': 'tagadmin',
  'alais': ["tagadmins"],
  'react': '🙀',
  'desc': "Tags all the admins in the group.",
  'category': 'group',
  'filename': __filename
}, async (_0x2180ae, _0x41ac32, _0x2e9138, {
  from: _0x2616a,
  prefix: _0xa4be17,
  l: _0x11b560,
  quoted: _0x2613b8,
  body: _0x467a99,
  isCmd: _0x38af41,
  command: _0x159cc0,
  args: _0x206a87,
  q: _0x5a7094,
  isGroup: _0x3fcba9,
  sender: _0x2d33ad,
  senderNumber: _0x2272d0,
  botNumber2: _0x27bc6f,
  botNumber: _0x428f22,
  pushname: _0x1aed08,
  isMe: _0x336ec0,
  isOwner: _0x331a4d,
  groupMetadata: _0x57c62a,
  groupName: _0x3231a9,
  participants: _0xe699,
  groupAdmins: _0x53ccdc,
  isBotAdmins: _0x4aa8ee,
  isAdmins: _0x575128,
  reply: _0x35f506
}) => {
  try {
    if (!_0x3fcba9) {
      return _0x35f506("This command is only for groups.");
    }
    if (!_0x575128) {
      return _0x35f506("Yah Command Srf Admins Ky Lya Hai !.");
    }
    if (_0x53ccdc.length === 0x0) {
      return _0x35f506("There are no admins in this group.");
    }
    let _0x14ad67 = "*TAGGING ALL ADMINS IN THE GROUP 🔳:*\n\n";
    for (let _0x166714 of _0x53ccdc) {
      _0x14ad67 += '@' + _0x166714.split('@')[0x0] + "\n";
    }
    await _0x2180ae.sendMessage(_0x2616a, {
      'text': _0x14ad67,
      'mentions': _0x53ccdc
    }, {
      'quoted': _0x41ac32
    });
  } catch (_0x2a7fa0) {
    console.error("Error tagging admins:", _0x2a7fa0);
    _0x35f506("you are not an admin.");
  }
});
cmd({
  'pattern': "mute",
  'alias': ["lock"],
  'react': '🔒',
  'desc': "mute group.",
  'category': "group",
  'filename': __filename
}, async (_0x188ee4, _0x2926d7, _0x5a0744, {
  from: _0x1446bd,
  l: _0x15ae12,
  quoted: _0x11cce4,
  body: _0x3901bf,
  isCmd: _0x37eecc,
  command: _0x2ed5f9,
  args: _0x3b6b0a,
  q: _0x7468c5,
  isGroup: _0x3aa6ce,
  sender: _0x1e204d,
  senderNumber: _0x683c2e,
  botNumber2: _0x26b4e2,
  botNumber: _0x2ddb86,
  pushname: _0x5c4eea,
  isMe: _0x33a6e7,
  isOwner: _0x39f686,
  groupMetadata: _0x5aedcf,
  groupName: _0x1026a0,
  participants: _0x5e633e,
  isItzcp: _0x4d966c,
  groupAdmins: _0xa75e9a,
  isBotAdmins: _0x5cd7fb,
  isAdmins: _0x32b120,
  reply: _0x4efac7
}) => {
  try {
    if (!_0x39f686 || !_0x32b120) {
      return;
    }
    if (!_0x5a0744.isGroup) {
      return _0x4efac7(mg.onlygroup);
    }
    if (!_0x5cd7fb) {
      return _0x4efac7(mg.needbotadmins);
    }
    await _0x188ee4.groupSettingUpdate(_0x5a0744.chat, "announcement");
    const _0x23264b = await _0x188ee4.sendMessage(_0x5a0744.chat, {
      'text': "*GROUP CHAT MUTED BY SILVA SPARK MD* 🔒"
    }, {
      'quoted': _0x2926d7
    });
    return await _0x188ee4.sendMessage(_0x5a0744.chat, {
      'react': {
        'text': '🔒',
        'key': _0x23264b.key
      }
    });
  } catch (_0x3ea7c2) {
    console.log(_0x3ea7c2);
    _0x4efac7("*Muja Admin Kar Pher Use Kar Commands ❗👻*");
  }
});
cmd({
  'pattern': "unmute",
  'alias': ["unlock"],
  'react': '🔓',
  'desc': "unmute group.",
  'category': "group",
  'filename': __filename
}, async (_0x298fe1, _0x116d41, _0x2602ac, {
  from: _0x15600e,
  l: _0x5ba8bd,
  quoted: _0x30a624,
  body: _0x314dcd,
  isCmd: _0x2536d0,
  command: _0x3d9eb1,
  args: _0x19ba22,
  q: _0x3f0c3c,
  isGroup: _0x4e57af,
  sender: _0x597d49,
  senderNumber: _0xda3f5a,
  botNumber2: _0x2f023e,
  botNumber: _0x1dd6f9,
  pushname: _0x5320d4,
  isMe: _0x48a143,
  isOwner: _0x2cda60,
  groupMetadata: _0x130d26,
  groupName: _0x4593b5,
  participants: _0x166fbf,
  isItzcp: _0x310852,
  groupAdmins: _0x2154a4,
  isBotAdmins: _0x16ccf1,
  isAdmins: _0x118e3c,
  reply: _0x33fff7
}) => {
  try {
    if (!_0x2cda60 || !_0x118e3c) {
      return;
    }
    if (!_0x2602ac.isGroup) {
      return _0x33fff7(mg.onlygroup);
    }
    if (!_0x16ccf1) {
      return _0x33fff7(mg.needbotadmins);
    }
    await _0x298fe1.groupSettingUpdate(_0x2602ac.chat, "not_announcement");
    const _0x74b371 = await _0x298fe1.sendMessage(_0x2602ac.chat, {
      'text': "*GROUP CHAT UNMUTED BY SPARK DE SILVA BOT* 🔒"
    }, {
      'quoted': _0x116d41
    });
    return await _0x298fe1.sendMessage(_0x2602ac.chat, {
      'react': {
        'text': '🔒',
        'key': _0x74b371.key
      }
    });
  } catch (_0x38466f) {
    console.log(_0x38466f);
    _0x33fff7("*Muja Admin Bana Phr Commands Kar❗👻*");
  }
});
cmd({
  'pattern': 'add',
  'alias': ["aja"],
  'react': '➕',
  'desc': "Adds a user to the group.",
  'category': 'group',
  'filename': __filename,
  'use': '<number>'
}, async (_0x29bcee, _0x5d8ef6, _0x56566a, {
  from: _0x2d1d85,
  quoted: _0x3437b0,
  body: _0x212da3,
  isCmd: _0x113379,
  command: _0x4b5bf0,
  args: _0xc1281a,
  q: _0x58d6f4,
  isGroup: _0x4e0892,
  sender: _0xf93582,
  senderNumber: _0x95b29f,
  botNumber2: _0x558f84,
  botNumber: _0x3571cd,
  pushname: _0x19af4b,
  isMe: _0x3ea7c4,
  isOwner: _0x5c85af,
  groupMetadata: _0x48378c,
  groupName: _0x3827d6,
  participants: _0x57e605,
  groupAdmins: _0x4ddcc9,
  isBotAdmins: _0x33dfec,
  isAdmins: _0x4424ae,
  reply: _0x227b1d
}) => {
  try {
    if (!_0x56566a.isGroup) {
      return _0x227b1d("This command is only for groups.");
    }
    if (!_0x33dfec) {
      return _0x227b1d("I need admin privileges to add users.");
    }
    if (!_0x58d6f4 || isNaN(_0x58d6f4)) {
      return _0x227b1d("Please provide a valid phone number to add.");
    }
    const _0x362df9 = _0x58d6f4 + "@s.whatsapp.net";
    await _0x29bcee.groupParticipantsUpdate(_0x56566a.chat, [_0x362df9], "add");
    _0x227b1d("User " + _0x58d6f4 + " has been added to the group.");
  } catch (_0x3f7309) {
    console.error("Error adding user:", _0x3f7309);
    _0x227b1d("An error occurred while adding the user. Please make sure the number is correct and they are not already in the group.");
  }
});
cmd({
  'pattern': "setgoodbye",
  'desc': "Set the goodbye message for the group.",
  'category': "group",
  'react': '👋',
  'filename': __filename
}, async (_0x51b23f, _0x21cb6a, _0x275d83, {
  from: _0x3ffb4d,
  quoted: _0x3f3f17,
  body: _0x4550f2,
  isCmd: _0x28286e,
  command: _0x97137b,
  args: _0x273812,
  q: _0x5ebbc8,
  isGroup: _0xb2710d,
  sender: _0x421d81,
  senderNumber: _0x16e90c,
  botNumber2: _0x2369c2,
  botNumber: _0x555438,
  pushname: _0x4c8d4a,
  isMe: _0x522db1,
  isOwner: _0x1db872,
  groupMetadata: _0x212b3d,
  groupName: _0x3d71b8,
  participants: _0x4da364,
  groupAdmins: _0x1a2b40,
  isBotAdmins: _0xf475c2,
  isAdmins: _0x533cde,
  reply: _0x4beca6
}) => {
  try {
    if (!_0xb2710d) {
      return _0x4beca6("This command can only be used in a group.");
    }
    if (!_0xf475c2) {
      return _0x4beca6("Bot must be an admin to use this command.");
    }
    if (!_0x533cde) {
      return _0x4beca6("You must be an admin to use this command.");
    }
    if (!_0x5ebbc8) {
      return _0x4beca6("Please provide a goodbye message.");
    }
    await _0x51b23f.sendMessage(_0x3ffb4d, {
      'image': {
        'url': config.ALIVE_IMG
      },
      'caption': _0x5ebbc8
    });
    await _0x4beca6("Goodbye message has been set.");
  } catch (_0xbbddb1) {
    console.log(_0xbbddb1);
    _0x4beca6('' + _0xbbddb1);
  }
});
cmd({
  'pattern': "setwelcome",
  'desc': "Set the welcome message for the group.",
  'category': "group",
  'react': '👋',
  'filename': __filename
}, async (_0x38c266, _0x3173c4, _0x390a75, {
  from: _0x3f6a31,
  quoted: _0x28a99e,
  body: _0x4ed0ca,
  isCmd: _0x4d0fa4,
  command: _0x400fb2,
  args: _0x3a8f9f,
  q: _0xd0a608,
  isGroup: _0x519fe5,
  sender: _0x19d08d,
  senderNumber: _0x4b3863,
  botNumber2: _0x1aaac2,
  botNumber: _0x5e81eb,
  pushname: _0x37028a,
  isMe: _0x2af145,
  isOwner: _0x5060d5,
  groupMetadata: _0x1378de,
  groupName: _0x463238,
  participants: _0x31482b,
  groupAdmins: _0x5cc3cc,
  isBotAdmins: _0x12d593,
  isAdmins: _0x35af97,
  reply: _0x4c430b
}) => {
  try {
    if (!_0x519fe5) {
      return _0x4c430b("This command can only be used in a group.");
    }
    if (!_0x12d593) {
      return _0x4c430b("Bot must be an admin to use this command.");
    }
    if (!_0x35af97) {
      return _0x4c430b("You must be an admin to use this command.");
    }
    if (!_0xd0a608) {
      return _0x4c430b("Please provide a welcome message.");
    }
    await _0x38c266.sendMessage(_0x3f6a31, {
      'image': {
        'url': config.ALIVE_IMG
      },
      'caption': _0xd0a608
    });
    await _0x4c430b("Welcome message has been set.");
  } catch (_0x416d4f) {
    console.log(_0x416d4f);
    _0x4c430b('' + _0x416d4f);
  }
});
