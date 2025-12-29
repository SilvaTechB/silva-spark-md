const config = require("../config");
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
} = require("../lib/functions");
const _0x235552 = {
  'pattern': 'joinrequests',
  'desc': "Get list of participants who requested to join the group",
  'react': '📋',
  'category': 'group',
  'filename': __filename
};
cmd(_0x235552, async (_0x5627f6, _0x3c9922, _0x196741, {
  from: _0x152438,
  q: _0x5b5aa4,
  reply: _0x56da10,
  isGroup: _0x163e8c
}) => {
  if (!_0x163e8c) {
    return _0x56da10("This command can only be used in a group chat.");
  }
  try {
    console.log("Attempting to fetch pending requests for group: " + _0x152438);
    const _0x1cec50 = await _0x5627f6.groupRequestParticipantsList(_0x152438);
    console.log(_0x1cec50);
    if (_0x1cec50.length > 0x0) {
      let _0x23374c = "Pending Requests to Join the Group:\n";
      let _0x17317a = [];
      _0x1cec50.forEach(_0x5e1d24 => {
        const _0x35ec96 = _0x5e1d24.jid;
        _0x23374c += "😻 @" + _0x35ec96.split('@')[0x0] + "\n";
        _0x17317a.push(_0x35ec96);
      });
      const _0x3d4716 = {
        'text': _0x23374c,
        'mentions': _0x17317a
      };
      await _0x5627f6.sendMessage(_0x152438, _0x3d4716);
    } else {
      _0x56da10("No pending requests to join the group.");
    }
  } catch (_0x4cac9e) {
    console.error("Error fetching participant requests: " + _0x4cac9e.message);
    _0x56da10("⚠️ An error occurred while fetching the pending requests. Please try again later.");
  }
});
const _0x485005 = {
  'pattern': "allreq",
  'desc': "Approve or reject all join requests",
  'react': '✅',
  'category': "group",
  'filename': __filename
};
cmd(_0x485005, async (_0x49ae26, _0xcdfa27, _0x2d27f9, {
  from: _0x249d9d,
  reply: _0x2c52c1,
  isGroup: _0x303374
}) => {
  if (!_0x303374) {
    return _0x2c52c1("This command can only be used in a group chat.");
  }
  const _0x5e0937 = _0x2d27f9.body.includes("approve") ? "approve" : "reject";
  try {
    const _0x495e05 = await _0x49ae26.groupRequestParticipantsList(_0x249d9d);
    if (_0x495e05.length === 0x0) {
      return _0x2c52c1("There are no pending requests to manage.");
    }
    let _0x1b4d8b = "Pending Requests to Join the Group:\n";
    let _0x5bd4ee = [];
    let _0x701413 = [];
    _0x495e05.forEach(_0x2e9edd => {
      const _0x17c569 = _0x2e9edd.jid;
      _0x1b4d8b += "😻 @" + _0x17c569.split('@')[0x0] + "\n";
      _0x5bd4ee.push(_0x17c569);
      _0x701413.push(_0x17c569);
    });
    const _0x56c60b = {
      'text': _0x1b4d8b,
      'mentions': _0x5bd4ee
    };
    await _0x49ae26.sendMessage(_0x249d9d, _0x56c60b);
    const _0x40e74d = await _0x49ae26.groupRequestParticipantsUpdate(_0x249d9d, _0x701413, _0x5e0937);
    console.log(_0x40e74d);
    _0x2c52c1("Successfully " + _0x5e0937 + "ed all join requests.");
  } catch (_0x2a4b2c) {
    console.error("Error updating participant requests: " + _0x2a4b2c.message);
    _0x2c52c1("⚠️ An error occurred while processing the request. Please try again later.");
  }
});
const _0x3bcce0 = {
  'pattern': "disappear",
  'react': "🌪️",
  'alias': ['dm'],
  'desc': "Turn on/off disappearing messages.",
  'category': "main",
  'filename': __filename
};
cmd(_0x3bcce0, async (_0x4981f9, _0x1ac44e, _0x59ef0d, {
  from: _0xde58d3,
  isGroup: _0x3ea2c4,
  isAdmins: _0x5aae90,
  args: _0x17b0ab
}) => {
  if (!_0x3ea2c4) {
    const _0x3038c7 = {
      'text': "This command can only be used in groups."
    };
    await _0x4981f9.sendMessage(_0xde58d3, _0x3038c7);
    return;
  }
  if (!_0x5aae90) {
    const _0x19d9ef = {
      'text': "Only admins can turn on/off disappearing messages."
    };
    await _0x4981f9.sendMessage(_0xde58d3, _0x19d9ef);
    return;
  }
  const _0x2c3dbc = _0x17b0ab[0x0];
  if (_0x2c3dbc === 'on') {
    const _0x1d6174 = _0x17b0ab[0x1];
    let _0x1de4ca;
    switch (_0x1d6174) {
      case "24h":
        _0x1de4ca = 0x15180;
        break;
      case '7d':
        _0x1de4ca = 0x93a80;
        break;
      case "90d":
        _0x1de4ca = 0x76a700;
        break;
      default:
        const _0x497298 = {
          'text': "Invalid duration! Use `24h`, `7d`, or `90d`."
        };
        await _0x4981f9.sendMessage(_0xde58d3, _0x497298);
        return;
    }
    const _0x18601c = {
      'disappearingMessagesInChat': _0x1de4ca
    };
    await _0x4981f9.sendMessage(_0xde58d3, _0x18601c);
    const _0x4b59f0 = {
      'text': "Disappearing messages are now ON for " + _0x1d6174 + '.'
    };
    await _0x4981f9.sendMessage(_0xde58d3, _0x4b59f0);
  } else {
    if (_0x2c3dbc === "off") {
      const _0x5951ff = {
        'disappearingMessagesInChat': false
      };
      await _0x4981f9.sendMessage(_0xde58d3, _0x5951ff);
      const _0x3b5871 = {
        'text': "Disappearing messages are now OFF."
      };
      await _0x4981f9.sendMessage(_0xde58d3, _0x3b5871);
    } else {
      const _0x957b6e = {
        'text': "Please use `!disappear on <duration>` or `!disappear off`."
      };
      await _0x4981f9.sendMessage(_0xde58d3, _0x957b6e);
    }
  }
});
const _0x592aaf = {
  'pattern': "senddm",
  'react': "🌪️",
  'alias': ["senddisappear"],
  'desc': "Send a disappearing message.",
  'category': "main",
  'filename': __filename
};
cmd(_0x592aaf, async (_0x43277d, _0x49a4bf, _0x1a9eee, {
  from: _0x4121e3,
  isGroup: _0x130587,
  isAdmins: _0x1f5a32,
  args: _0x59db09
}) => {
  if (!_0x130587) {
    const _0x3db64e = {
      'text': "This command can only be used in groups."
    };
    await _0x43277d.sendMessage(_0x4121e3, _0x3db64e);
    return;
  }
  if (!_0x59db09.length) {
    const _0xab756b = {
      'text': "Please provide a message to send."
    };
    await _0x43277d.sendMessage(_0x4121e3, _0xab756b);
    return;
  }
  const _0x378c1a = _0x59db09.join(" ");
  const _0x57700b = {
    'text': _0x378c1a
  };
  const _0x236fb8 = {
    'ephemeralExpiration': 0x93a80
  };
  await _0x43277d.sendMessage(_0x4121e3, _0x57700b, _0x236fb8);
});
const _0x4f6b5b = {
  'pattern': 'mute',
  'react': '🔇',
  'alias': ["close", "f_mute"],
  'desc': "Change to group settings to only admins can send messages.",
  'category': "group",
  'use': '.mute',
  'filename': __filename
};
cmd(_0x4f6b5b, async (_0x1db32, _0x1034bb, _0x25ca2a, {
  from: _0x3eb37e,
  l: _0xb9c9be,
  quoted: _0x29d293,
  body: _0x2db992,
  isCmd: _0x500c26,
  command: _0x4fc99e,
  args: _0x59c2e4,
  q: _0x8908a8,
  isGroup: _0x5b1d5a,
  sender: _0x1a5d9d,
  senderNumber: _0x403beb,
  botNumber2: _0x2649be,
  botNumber: _0x357b82,
  pushname: _0x46f320,
  isMe: _0x2189c8,
  isOwner: _0x404021,
  groupMetadata: _0x501cc6,
  groupName: _0x29b9be,
  participants: _0x3bf764,
  groupAdmins: _0x23192c,
  isBotAdmins: _0x3113e1,
  isCreator: _0x3a14cd,
  isDev: _0x536689,
  isAdmins: _0x183163,
  reply: _0x58a333
}) => {
  try {
    const _0x500a97 = (await fetchJson('https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg;
    if (!_0x5b1d5a) {
      return _0x58a333(_0x500a97.only_gp);
    }
    if (!_0x183163) {
      const _0x2f558f = {
        'quoted': _0x1034bb
      };
      if (!_0x536689) {
        _0x58a333(_0x500a97.you_adm);
        return _0x2f558f;
      }
    }
    if (!_0x3113e1) {
      return _0x58a333(_0x500a97.give_adm);
    }
    await _0x1db32.groupSettingUpdate(_0x3eb37e, 'announcement');
    const _0x36519b = {
      'text': "*Group Chat closed by Admin " + _0x46f320 + "* 🔇"
    };
    const _0x4744ef = {
      'quoted': _0x1034bb
    };
    await _0x1db32.sendMessage(_0x3eb37e, _0x36519b, _0x4744ef);
  } catch (_0xa7a872) {
    const _0x521c5e = {
      'text': '❌',
      'key': _0x1034bb.key
    };
    const _0x2837a2 = {
      'react': _0x521c5e
    };
    await _0x1db32.sendMessage(_0x3eb37e, _0x2837a2);
    console.log(_0xa7a872);
    _0x58a333("❌ *Error Accurated !!*\n\n" + _0xa7a872);
  }
});
const _0x87e572 = {
  'pattern': 'unmute',
  'react': '🔇',
  'alias': ["open", 'f_unmute'],
  'desc': "Change to group settings to all members can send messages.",
  'category': "group",
  'use': ".unmute",
  'filename': __filename
};
cmd(_0x87e572, async (_0x25e894, _0x173e12, _0x5cc272, {
  from: _0xeeb31b,
  l: _0x58264a,
  quoted: _0x81dda4,
  body: _0x2ccf26,
  isCmd: _0x2347d3,
  command: _0x42a3e4,
  args: _0x5a986a,
  q: _0x1dfbee,
  isGroup: _0x2d3d91,
  sender: _0x4f63db,
  senderNumber: _0x2d4d48,
  botNumber2: _0x1577ce,
  botNumber: _0x210cd0,
  pushname: _0x165f81,
  isMe: _0x296039,
  isOwner: _0x486497,
  groupMetadata: _0x2b0178,
  groupName: _0x5317ab,
  participants: _0x1138a8,
  groupAdmins: _0x4ec8e3,
  isBotAdmins: _0x351607,
  isCreator: _0x353ee1,
  isDev: _0x41f549,
  isAdmins: _0x5bcb46,
  reply: _0x3b61c9
}) => {
  try {
    const _0x132ae2 = (await fetchJson('https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg;
    if (!_0x2d3d91) {
      return _0x3b61c9(_0x132ae2.only_gp);
    }
    if (!_0x5bcb46) {
      const _0x48b9a1 = {
        'quoted': _0x173e12
      };
      if (!_0x41f549) {
        _0x3b61c9(_0x132ae2.you_adm);
        return _0x48b9a1;
      }
    }
    if (!_0x351607) {
      return _0x3b61c9(_0x132ae2.give_adm);
    }
    await _0x25e894.groupSettingUpdate(_0xeeb31b, "not_announcement");
    const _0x37b570 = {
      'text': "*Group Chat Opened by Admin " + _0x165f81 + "* 🔇"
    };
    const _0xfed4bb = {
      'quoted': _0x173e12
    };
    await _0x25e894.sendMessage(_0xeeb31b, _0x37b570, _0xfed4bb);
  } catch (_0x23da8f) {
    const _0x2c4198 = {
      'text': '❌',
      'key': _0x173e12.key
    };
    const _0x3d6c71 = {
      'react': _0x2c4198
    };
    await _0x25e894.sendMessage(_0xeeb31b, _0x3d6c71);
    console.log(_0x23da8f);
    _0x3b61c9("❌ *Error Accurated !!*\n\n" + _0x23da8f);
  }
});
const _0x2bff43 = {
  'pattern': "lockgs",
  'react': '🔇',
  'alias': ["lockgsettings"],
  'desc': "Change to group settings to only admins can edit group info",
  'category': "group",
  'use': '.lockgs',
  'filename': __filename
};
cmd(_0x2bff43, async (_0x1544c8, _0x3a8967, _0x3a98a6, {
  from: _0x498d74,
  l: _0x242d02,
  quoted: _0x36365b,
  body: _0x6eab77,
  isCmd: _0x304a8f,
  command: _0x354db8,
  args: _0x3c3dde,
  q: _0x2751b9,
  isGroup: _0x3469a1,
  sender: _0x2a2cfe,
  senderNumber: _0x5ba54c,
  botNumber2: _0x13db3b,
  botNumber: _0x147018,
  pushname: _0x4a7385,
  isMe: _0x58cf74,
  isOwner: _0x4b72ad,
  groupMetadata: _0x2e602b,
  groupName: _0x4814c6,
  participants: _0x50dfe6,
  groupAdmins: _0x4e1045,
  isBotAdmins: _0x50a963,
  isCreator: _0x4d04a5,
  isDev: _0x21193e,
  isAdmins: _0x3d7529,
  reply: _0x5ed333
}) => {
  try {
    const _0x1039b6 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x3469a1) {
      return _0x5ed333(_0x1039b6.only_gp);
    }
    if (!_0x3d7529) {
      const _0x155d21 = {
        'quoted': _0x3a8967
      };
      if (!_0x21193e) {
        _0x5ed333(_0x1039b6.you_adm);
        return _0x155d21;
      }
    }
    if (!_0x50a963) {
      return _0x5ed333(_0x1039b6.give_adm);
    }
    await _0x1544c8.groupSettingUpdate(_0x498d74, 'locked');
    const _0x5db9eb = {
      'text': "*Group settings Locked* 🔒"
    };
    const _0x3d6f8d = {
      'quoted': _0x3a8967
    };
    await _0x1544c8.sendMessage(_0x498d74, _0x5db9eb, _0x3d6f8d);
  } catch (_0x16dbea) {
    const _0x8a66fe = {
      'text': '❌',
      'key': _0x3a8967.key
    };
    const _0x5d8236 = {
      'react': _0x8a66fe
    };
    await _0x1544c8.sendMessage(_0x498d74, _0x5d8236);
    console.log(_0x16dbea);
    _0x5ed333("❌ *Error Accurated !!*\n\n" + _0x16dbea);
  }
});
const _0x285abb = {
  'pattern': 'unlockgs',
  'react': '🔓',
  'alias': ['unlockgsettings'],
  'desc': "Change to group settings to all members can edit group info",
  'category': 'group',
  'use': '.unlockgs',
  'filename': __filename
};
cmd(_0x285abb, async (_0x5b301d, _0x3b7b70, _0x2cc26e, {
  from: _0x4d3c01,
  l: _0x176622,
  quoted: _0x37c3f2,
  body: _0x3fbb36,
  isCmd: _0x51482e,
  command: _0xd3f200,
  args: _0x509332,
  q: _0x44f8fa,
  isGroup: _0x1e2ad3,
  sender: _0x41c2a2,
  senderNumber: _0x53d357,
  botNumber2: _0x29bf53,
  botNumber: _0x2a719b,
  pushname: _0x4d9f7c,
  isMe: _0x3aee0d,
  isOwner: _0x71e650,
  groupMetadata: _0xe73a5f,
  groupName: _0x2f6917,
  participants: _0x43c59f,
  groupAdmins: _0x3d8f6f,
  isBotAdmins: _0x3d74ba,
  isCreator: _0x414dbd,
  isDev: _0x2c354b,
  isAdmins: _0xff1420,
  reply: _0xbc1d4c
}) => {
  try {
    const _0x5091d1 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x1e2ad3) {
      return _0xbc1d4c(_0x5091d1.only_gp);
    }
    if (!_0xff1420) {
      const _0x1f11d9 = {
        'quoted': _0x3b7b70
      };
      if (!_0x2c354b) {
        _0xbc1d4c(_0x5091d1.you_adm);
        return _0x1f11d9;
      }
    }
    if (!_0x3d74ba) {
      return _0xbc1d4c(_0x5091d1.give_adm);
    }
    await _0x5b301d.groupSettingUpdate(_0x4d3c01, "unlocked");
    const _0x53e034 = {
      'text': "*Group settings Unlocked* 🔓"
    };
    const _0x3fc266 = {
      'quoted': _0x3b7b70
    };
    await _0x5b301d.sendMessage(_0x4d3c01, _0x53e034, _0x3fc266);
  } catch (_0x3b7c9f) {
    const _0x371437 = {
      'text': '❌',
      'key': _0x3b7b70.key
    };
    const _0x37fa5b = {
      'react': _0x371437
    };
    await _0x5b301d.sendMessage(_0x4d3c01, _0x37fa5b);
    console.log(_0x3b7c9f);
    _0xbc1d4c("❌ *Error Accurated !!*\n\n" + _0x3b7c9f);
  }
});
const _0x2ad4fd = {
  'pattern': "djdjdjdjdjdjdjdjdj",
  'react': '🔓',
  'alias': ["ayeeeeeeeeee", "lllllllllllllll", 'nnnnn', "ppppppppopo", "ttttttttttttttttt"],
  'desc': "To leave from the group",
  'category': "group",
  'use': ".kuch nahi",
  'filename': __filename
};
cmd(_0x2ad4fd, async (_0x57ca03, _0x3887fa, _0x4fce7e, {
  from: _0xc68888,
  l: _0x1282e3,
  quoted: _0x57ed20,
  body: _0x10f606,
  isCmd: _0xe8fc04,
  command: _0x1a8e92,
  args: _0x4f8537,
  q: _0xdfea9b,
  isGroup: _0x4a4781,
  sender: _0x365a0c,
  senderNumber: _0x46d54a,
  botNumber2: _0x3be42d,
  botNumber: _0x5463fe,
  pushname: _0xb5c3cd,
  isMe: _0xca9405,
  isOwner: _0x3d58af,
  groupMetadata: _0x160843,
  groupName: _0x4b3e84,
  participants: _0x2c85cd,
  groupAdmins: _0x5d97cf,
  isBotAdmins: _0x25501b,
  isCreator: _0x50edb5,
  isDev: _0x23245,
  isAdmins: _0x237aa4,
  reply: _0x4da4af
}) => {
  try {
    const _0x21c4f5 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x4a4781) {
      return _0x4da4af(_0x21c4f5.only_gp);
    }
    if (!_0x237aa4) {
      if (!_0x23245) {
        return _0x4da4af(_0x21c4f5.you_adm);
      }
    }
    const _0x51bec9 = {
      'text': "*Good Bye All* 👋🏻"
    };
    const _0x57034a = {
      'quoted': _0x3887fa
    };
    await _0x57ca03.sendMessage(_0xc68888, _0x51bec9, _0x57034a);
    await _0x57ca03.groupLeave(_0xc68888);
  } catch (_0x2f90a5) {
    const _0x3b1e22 = {
      'text': '❌',
      'key': _0x3887fa.key
    };
    const _0x342f73 = {
      'react': _0x3b1e22
    };
    await _0x57ca03.sendMessage(_0xc68888, _0x342f73);
    console.log(_0x2f90a5);
    _0x4da4af("❌ *Error Accurated !!*\n\n" + _0x2f90a5);
  }
});
const _0x293215 = {
  'pattern': "updategname",
  'react': '🔓',
  'alias': ["upgname", 'gname'],
  'desc': "To Change the group name",
  'category': 'group',
  'use': '.updategname',
  'filename': __filename
};
cmd(_0x293215, async (_0x2aa48a, _0x3602cd, _0x1cbce2, {
  from: _0x45ad08,
  l: _0xa090a9,
  quoted: _0x140510,
  body: _0xd8ae2d,
  isCmd: _0x437e3b,
  command: _0x40ca0c,
  args: _0x41b4fb,
  q: _0x48b32f,
  isGroup: _0x3c8a42,
  sender: _0x2d52ff,
  senderNumber: _0x326df8,
  botNumber2: _0x376078,
  botNumber: _0x336b9f,
  pushname: _0x566409,
  isMe: _0x77a2fd,
  isOwner: _0x281739,
  groupMetadata: _0x26008d,
  groupName: _0x133a26,
  participants: _0x355c6d,
  groupAdmins: _0x3307cd,
  isBotAdmins: _0x21be18,
  isCreator: _0x1f3260,
  isDev: _0x67bfd1,
  isAdmins: _0x41f9b9,
  reply: _0x5a7586
}) => {
  try {
    const _0x14b230 = (await fetchJson('https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg;
    if (!_0x3c8a42) {
      return _0x5a7586(_0x14b230.only_gp);
    }
    if (!_0x41f9b9) {
      const _0x4d9f16 = {
        'quoted': _0x3602cd
      };
      if (!_0x67bfd1) {
        _0x5a7586(_0x14b230.you_adm);
        return _0x4d9f16;
      }
    }
    if (!_0x21be18) {
      return _0x5a7586(_0x14b230.give_adm);
    }
    if (!_0x48b32f) {
      return _0x5a7586("*Please write the new Group Subject* 🖊️");
    }
    await _0x2aa48a.groupUpdateSubject(_0x45ad08, _0x48b32f);
    const _0x2b8140 = {
      'text': "✔️ *Group name Updated*"
    };
    const _0x51ea6e = {
      'quoted': _0x3602cd
    };
    await _0x2aa48a.sendMessage(_0x45ad08, _0x2b8140, _0x51ea6e);
  } catch (_0x34ae8f) {
    const _0x2bfcde = {
      'text': '❌',
      'key': _0x3602cd.key
    };
    const _0x1de2ed = {
      'react': _0x2bfcde
    };
    await _0x2aa48a.sendMessage(_0x45ad08, _0x1de2ed);
    console.log(_0x34ae8f);
    _0x5a7586("❌ *Error Accurated !!*\n\n" + _0x34ae8f);
  }
});
const _0x19cdd8 = {
  'pattern': "updategdesc",
  'react': '🔓',
  'alias': ['upgdesc', "gdesc"],
  'desc': "To Change the group description",
  'category': "group",
  'use': ".updategdesc",
  'filename': __filename
};
cmd(_0x19cdd8, async (_0x3b5d59, _0x500dad, _0xdfb924, {
  from: _0x516246,
  l: _0x19ec9a,
  quoted: _0x1819d0,
  body: _0x30fdcc,
  isCmd: _0x515c22,
  command: _0x1fd1cd,
  args: _0x4e0bf3,
  q: _0x556f9f,
  isGroup: _0x13d490,
  sender: _0x1df8c1,
  senderNumber: _0x3a2430,
  botNumber2: _0x220610,
  botNumber: _0x591fe3,
  pushname: _0x2b36ae,
  isMe: _0x606490,
  isOwner: _0x526323,
  groupMetadata: _0x384f6d,
  groupName: _0x5f5794,
  participants: _0x264fd2,
  groupAdmins: _0xba3383,
  isBotAdmins: _0x3cae00,
  isCreator: _0x502deb,
  isDev: _0x50102c,
  isAdmins: _0x504a32,
  reply: _0x2d0d35
}) => {
  try {
    const _0x22a47e = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x13d490) {
      return _0x2d0d35(_0x22a47e.only_gp);
    }
    if (!_0x504a32) {
      const _0x16afa8 = {
        'quoted': _0x500dad
      };
      if (!_0x50102c) {
        _0x2d0d35(_0x22a47e.you_adm);
        return _0x16afa8;
      }
    }
    if (!_0x3cae00) {
      return _0x2d0d35(_0x22a47e.give_adm);
    }
    if (!_0x556f9f) {
      return _0x2d0d35("*Please write the new Group Description* 🖊️");
    }
    await _0x3b5d59.groupUpdateDescription(_0x516246, _0x556f9f);
    const _0x49e14d = {
      'text': "✔️ *Group Description Updated*"
    };
    const _0x543531 = {
      'quoted': _0x500dad
    };
    await _0x3b5d59.sendMessage(_0x516246, _0x49e14d, _0x543531);
  } catch (_0x57cb62) {
    const _0x31e856 = {
      'text': '❌',
      'key': _0x500dad.key
    };
    const _0x308db1 = {
      'react': _0x31e856
    };
    await _0x3b5d59.sendMessage(_0x516246, _0x308db1);
    console.log(_0x57cb62);
    _0x2d0d35("❌ *Error Accurated !!*\n\n" + _0x57cb62);
  }
});
const _0x53f490 = {
  'pattern': "join",
  'react': '📬',
  'alias': ["joinme", "f_join"],
  'desc': "To Join a Group from Invite link",
  'category': "group",
  'use': ".join < Group Link >",
  'filename': __filename
};
cmd(_0x53f490, async (_0x47c9d7, _0x35ca33, _0x4e5ffe, {
  from: _0x15bbf1,
  l: _0x2b246e,
  quoted: _0x439d00,
  body: _0x12d064,
  isCmd: _0x5bd4dd,
  command: _0x1d9eb2,
  args: _0x283da0,
  q: _0x1f1cc7,
  isGroup: _0x456f2e,
  sender: _0x2595cc,
  senderNumber: _0x53fe6b,
  botNumber2: _0x1fe6e4,
  botNumber: _0x4d1c42,
  pushname: _0x3c2ff7,
  isMe: _0x39e0e1,
  isOwner: _0x55939f,
  groupMetadata: _0x55d05e,
  groupName: _0xe82872,
  participants: _0x5b2e7d,
  groupAdmins: _0x84a5f3,
  isBotAdmins: _0x5ee4f7,
  isCreator: _0x571c2f,
  isDev: _0x29ee1,
  isAdmins: _0x19b4d1,
  reply: _0x12d263
}) => {
  try {
    const _0x12bb44 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x571c2f && !_0x29ee1 && !_0x55939f && !_0x39e0e1) {
      return _0x12d263(_0x12bb44.own_cmd);
    }
    if (!_0x1f1cc7) {
      return _0x12d263("*Please write the Group Link*️ 🖇️");
    }
    let _0x28e07b = _0x283da0[0x0].split('https://chat.whatsapp.com/')[0x1];
    await _0x47c9d7.groupAcceptInvite(_0x28e07b);
    const _0x3f0d45 = {
      'text': "✔️ *Successfully Joined*"
    };
    const _0x2e8dca = {
      'quoted': _0x35ca33
    };
    await _0x47c9d7.sendMessage(_0x15bbf1, _0x3f0d45, _0x2e8dca);
  } catch (_0x39c9f4) {
    const _0x2dd285 = {
      'text': '❌',
      'key': _0x35ca33.key
    };
    const _0x172b23 = {
      'react': _0x2dd285
    };
    await _0x47c9d7.sendMessage(_0x15bbf1, _0x172b23);
    console.log(_0x39c9f4);
    _0x12d263("❌ *Error Accurated !!*\n\n" + _0x39c9f4);
  }
});
const _0x4df201 = {
  'pattern': "invite",
  'react': "🖇️",
  'alias': ['grouplink', "glink"],
  'desc': "To Get the Group Invite link",
  'category': "group",
  'use': ".invite",
  'filename': __filename
};
cmd(_0x4df201, async (_0x5ca0b3, _0x1d2aac, _0x5ae3b9, {
  from: _0x17b97f,
  l: _0x320435,
  quoted: _0x32016d,
  body: _0x2afdd5,
  isCmd: _0x226900,
  command: _0x155d31,
  args: _0x29a67f,
  q: _0x4862f2,
  isGroup: _0x2e5d88,
  sender: _0x253057,
  senderNumber: _0x461579,
  botNumber2: _0x2dcc66,
  botNumber: _0x3dac62,
  pushname: _0x46651c,
  isMe: _0x43878c,
  isOwner: _0x2db519,
  groupMetadata: _0x5ccd53,
  groupName: _0x142c7c,
  participants: _0x457d22,
  groupAdmins: _0x27605d,
  isBotAdmins: _0x29764e,
  isCreator: _0x27414b,
  isDev: _0x7de5ca,
  isAdmins: _0x3f2992,
  reply: _0x4b7e40
}) => {
  try {
    const _0x5ab1ee = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x2e5d88) {
      return _0x4b7e40(_0x5ab1ee.only_gp);
    }
    if (!_0x3f2992) {
      const _0x1ff13e = {
        'quoted': _0x1d2aac
      };
      if (!_0x7de5ca) {
        _0x4b7e40(_0x5ab1ee.you_adm);
        return _0x1ff13e;
      }
    }
    if (!_0x29764e) {
      return _0x4b7e40(_0x5ab1ee.give_adm);
    }
    const _0x191ef8 = await _0x5ca0b3.groupInviteCode(_0x17b97f);
    const _0x29587e = {
      'text': "🖇️ *Group Link*\n\nhttps://chat.whatsapp.com/" + _0x191ef8
    };
    const _0x125136 = {
      'quoted': _0x1d2aac
    };
    await _0x5ca0b3.sendMessage(_0x17b97f, _0x29587e, _0x125136);
  } catch (_0x63c156) {
    const _0x476c01 = {
      'text': '❌',
      'key': _0x1d2aac.key
    };
    const _0x537f80 = {
      'react': _0x476c01
    };
    await _0x5ca0b3.sendMessage(_0x17b97f, _0x537f80);
    console.log(_0x63c156);
    _0x4b7e40("❌ *Error Accurated !!*\n\n" + _0x63c156);
  }
});
const _0x34bd2a = {
  'pattern': "revoke",
  'react': "🖇️",
  'alias': ["revokegrouplink", "resetglink", "revokelink", "f_revoke"],
  'desc': "To Reset the group link",
  'category': 'group',
  'use': '.revoke',
  'filename': __filename
};
cmd(_0x34bd2a, async (_0xd64721, _0x5b20b2, _0x2bf8dd, {
  from: _0x2a4c3b,
  l: _0x38cd01,
  quoted: _0x207ad7,
  body: _0x523130,
  isCmd: _0x7343fe,
  command: _0x288b13,
  args: _0x4157cf,
  q: _0x250059,
  isGroup: _0x7863dd,
  sender: _0x92a6a8,
  senderNumber: _0x2fee70,
  botNumber2: _0x238294,
  botNumber: _0x549be0,
  pushname: _0x302895,
  isMe: _0x6e68f8,
  isOwner: _0xffeee0,
  groupMetadata: _0xe2b0b4,
  groupName: _0x18bb6f,
  participants: _0x527bd5,
  groupAdmins: _0xd1b113,
  isBotAdmins: _0x242d35,
  isCreator: _0x2dd9e1,
  isDev: _0x4361df,
  isAdmins: _0x2050dd,
  reply: _0x1ae877
}) => {
  try {
    const _0x5ba157 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x7863dd) {
      return _0x1ae877(_0x5ba157.only_gp);
    }
    if (!_0x2050dd) {
      const _0x166031 = {
        'quoted': _0x5b20b2
      };
      if (!_0x4361df) {
        _0x1ae877(_0x5ba157.you_adm);
        return _0x166031;
      }
    }
    if (!_0x242d35) {
      return _0x1ae877(_0x5ba157.give_adm);
    }
    await _0xd64721.groupRevokeInvite(_0x2a4c3b);
    const _0x56209b = {
      'text': "*Group link Reseted* ⛔"
    };
    const _0x3abb77 = {
      'quoted': _0x5b20b2
    };
    await _0xd64721.sendMessage(_0x2a4c3b, _0x56209b, _0x3abb77);
  } catch (_0x1d9b7d) {
    const _0x11ba01 = {
      'text': '❌',
      'key': _0x5b20b2.key
    };
    const _0x1c73fc = {
      'react': _0x11ba01
    };
    await _0xd64721.sendMessage(_0x2a4c3b, _0x1c73fc);
    console.log(_0x1d9b7d);
    _0x1ae877("❌ *Error Accurated !!*\n\n" + _0x1d9b7d);
  }
});
const _0x57538f = {
  'pattern': "kick",
  'react': '🥏',
  'alias': ["remove"],
  'desc': "To Remove a participant from Group",
  'category': "group",
  'use': ".kick",
  'filename': __filename
};
cmd(_0x57538f, async (_0xdf818e, _0xa69965, _0x290fe5, {
  from: _0x277530,
  l: _0x1424d7,
  quoted: _0xc99b4e,
  body: _0x5195f3,
  isCmd: _0x1a81a4,
  command: _0x1ee878,
  mentionByTag: _0x383b10,
  args: _0x2e0664,
  q: _0x3bfd97,
  isGroup: _0x2af926,
  sender: _0x4ff03c,
  senderNumber: _0x374722,
  botNumber2: _0x5e6e97,
  botNumber: _0x28b955,
  pushname: _0x511cf4,
  isMe: _0x59c181,
  isOwner: _0x3fc01d,
  groupMetadata: _0xfdebc1,
  groupName: _0x4f1621,
  participants: _0x45edd7,
  groupAdmins: _0x91732c,
  isBotAdmins: _0x54a5f9,
  isCreator: _0x32ceb6,
  isDev: _0x58a57b,
  isAdmins: _0x5ad85f,
  reply: _0x3823f7
}) => {
  try {
    const _0x10dd83 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x2af926) {
      return _0x3823f7(_0x10dd83.only_gp);
    }
    if (!_0x5ad85f) {
      const _0x5787bc = {
        'quoted': _0xa69965
      };
      if (!_0x58a57b) {
        _0x3823f7(_0x10dd83.you_adm);
        return _0x5787bc;
      }
    }
    if (!_0x54a5f9) {
      return _0x3823f7(_0x10dd83.give_adm);
    }
    let _0x1bed6a = _0xa69965.mentionedJid ? _0xa69965.mentionedJid[0x0] : _0xa69965.msg.contextInfo.participant || false;
    if (!_0x1bed6a) {
      return _0x3823f7("*Couldn't find any user in context* ❌");
    }
    await _0xdf818e.groupParticipantsUpdate(_0x277530, [_0x1bed6a], "remove");
    const _0x46ed61 = {
      'text': "*Successfully removed*  ✔️"
    };
    const _0x281eec = {
      'quoted': _0xa69965
    };
    await _0xdf818e.sendMessage(_0x277530, _0x46ed61, _0x281eec);
  } catch (_0x5212f6) {
    const _0x310822 = {
      'text': '❌',
      'key': _0xa69965.key
    };
    const _0x3053a8 = {
      'react': _0x310822
    };
    await _0xdf818e.sendMessage(_0x277530, _0x3053a8);
    console.log(_0x5212f6);
    _0x3823f7("❌ *Error Accurated !!*\n\n" + _0x5212f6);
  }
});
const _0xd699f4 = {
  'pattern': "promote",
  'react': '🥏',
  'alias': ["addadmin"],
  'desc': "To Add a participatant as a Admin",
  'category': 'group',
  'use': ".promote",
  'filename': __filename
};
cmd(_0xd699f4, async (_0x4924ea, _0x5010b3, _0x3c1d65, {
  from: _0x49e602,
  l: _0x33cb28,
  quoted: _0x5c131b,
  body: _0x56af54,
  isCmd: _0x2c4d1d,
  command: _0x5c9432,
  mentionByTag: _0x866e04,
  args: _0x21c205,
  q: _0xa50d6e,
  isGroup: _0x411587,
  sender: _0x343c09,
  senderNumber: _0x4205b9,
  botNumber2: _0x430b16,
  botNumber: _0x385106,
  pushname: _0x56aa61,
  isMe: _0xe7e204,
  isOwner: _0x30c7e8,
  groupMetadata: _0x3c38bf,
  groupName: _0x588879,
  participants: _0xe3d0b3,
  groupAdmins: _0x153505,
  isBotAdmins: _0x4091e7,
  isCreator: _0x22a9c2,
  isDev: _0x5d9c32,
  isAdmins: _0x233034,
  reply: _0x542673
}) => {
  try {
    const _0x4208b6 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x411587) {
      return _0x542673(_0x4208b6.only_gp);
    }
    if (!_0x233034) {
      const _0x30c355 = {
        'quoted': _0x5010b3
      };
      if (!_0x5d9c32) {
        _0x542673(_0x4208b6.you_adm);
        return _0x30c355;
      }
    }
    if (!_0x4091e7) {
      return _0x542673(_0x4208b6.give_adm);
    }
    let _0x43bdf3 = _0x5010b3.mentionedJid ? _0x5010b3.mentionedJid[0x0] : _0x5010b3.msg.contextInfo.participant || false;
    if (!_0x43bdf3) {
      return _0x542673("*Couldn't find any user in context* ❌");
    }
    const _0x58b5eb = await getGroupAdmins(_0xe3d0b3);
    if (_0x58b5eb.includes(_0x43bdf3)) {
      return _0x542673("❗ *User Already an Admin*  ✔️");
    }
    await _0x4924ea.groupParticipantsUpdate(_0x49e602, [_0x43bdf3], "promote");
    const _0x2a97e1 = {
      'text': "*User promoted as an Admin*  ✔️"
    };
    const _0x47980e = {
      'quoted': _0x5010b3
    };
    await _0x4924ea.sendMessage(_0x49e602, _0x2a97e1, _0x47980e);
  } catch (_0x3cdda4) {
    const _0x5d1425 = {
      'text': '❌',
      'key': _0x5010b3.key
    };
    const _0x183397 = {
      'react': _0x5d1425
    };
    await _0x4924ea.sendMessage(_0x49e602, _0x183397);
    console.log(_0x3cdda4);
    _0x542673("❌ *Error Accurated !!*\n\n" + _0x3cdda4);
  }
});
const _0x10f253 = {
  'pattern': "demote",
  'react': '🥏',
  'alias': ["removeadmin"],
  'desc': "To Demote Admin to Member",
  'category': "group",
  'use': ".demote",
  'filename': __filename
};
cmd(_0x10f253, async (_0x100559, _0x26bd3b, _0x19d9e3, {
  from: _0x23fa85,
  l: _0x5d6046,
  quoted: _0x2ccaeb,
  body: _0x5b3e9b,
  isCmd: _0x286195,
  command: _0x58a518,
  mentionByTag: _0x465dce,
  args: _0x37c9f5,
  q: _0x23caef,
  isGroup: _0x472133,
  sender: _0x4d20bd,
  senderNumber: _0x3dcd8c,
  botNumber2: _0x403a3e,
  botNumber: _0x543e39,
  pushname: _0x4f7e0c,
  isMe: _0x2a1784,
  isOwner: _0x1ec34f,
  groupMetadata: _0x26a272,
  groupName: _0xb5af0c,
  participants: _0x2d8ac7,
  groupAdmins: _0x2571d5,
  isBotAdmins: _0x270691,
  isCreator: _0x2c64c3,
  isDev: _0x795a5f,
  isAdmins: _0x576070,
  reply: _0x391013
}) => {
  try {
    const _0xaf2bbe = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x472133) {
      return _0x391013(_0xaf2bbe.only_gp);
    }
    if (!_0x576070) {
      const _0x15e5c1 = {
        'quoted': _0x26bd3b
      };
      if (!_0x795a5f) {
        _0x391013(_0xaf2bbe.you_adm);
        return _0x15e5c1;
      }
    }
    if (!_0x270691) {
      return _0x391013(_0xaf2bbe.give_adm);
    }
    let _0x4261f8 = _0x26bd3b.mentionedJid ? _0x26bd3b.mentionedJid[0x0] : _0x26bd3b.msg.contextInfo.participant || false;
    if (!_0x4261f8) {
      return _0x391013("*Couldn't find any user in context* ❌");
    }
    const _0xc25d0c = await getGroupAdmins(_0x2d8ac7);
    if (!_0xc25d0c.includes(_0x4261f8)) {
      return _0x391013("❗ *User Already not an Admin*");
    }
    await _0x100559.groupParticipantsUpdate(_0x23fa85, [_0x4261f8], "demote");
    const _0x3cd26a = {
      'text': "*User No longer an Admin*  ✔️"
    };
    const _0x59c923 = {
      'quoted': _0x26bd3b
    };
    await _0x100559.sendMessage(_0x23fa85, _0x3cd26a, _0x59c923);
  } catch (_0x29a8ff) {
    const _0x271890 = {
      'text': '❌',
      'key': _0x26bd3b.key
    };
    const _0x1d1d66 = {
      'react': _0x271890
    };
    await _0x100559.sendMessage(_0x23fa85, _0x1d1d66);
    console.log(_0x29a8ff);
    _0x391013("❌ *Error Accurated !!*\n\n" + _0x29a8ff);
  }
});
const _0x53a4af = {
  'pattern': "tagall",
  'react': '🔊',
  'alias': ["f_tagall"],
  'desc': "To Tag all Members",
  'category': "group",
  'use': ".tagall",
  'filename': __filename
};
cmd(_0x53a4af, async (_0x4b7a1c, _0x355fbd, _0xc06583, {
  from: _0x43cf50,
  l: _0x1274f4,
  quoted: _0x68b28c,
  body: _0x128cda,
  isCmd: _0x39b2e3,
  command: _0x4b97ec,
  mentionByTag: _0x17f382,
  args: _0x28acb9,
  q: _0x6f0c26,
  isGroup: _0x88d6b,
  sender: _0x57c54c,
  senderNumber: _0x17e523,
  botNumber2: _0x5bf942,
  botNumber: _0x5a4bfe,
  pushname: _0x5be918,
  isMe: _0x5d664d,
  isOwner: _0x5737c9,
  groupMetadata: _0x2e5eaa,
  groupName: _0x112cbc,
  participants: _0x31686b,
  groupAdmins: _0x3cb5d5,
  isBotAdmins: _0x24571c,
  isCreator: _0x2399d3,
  isDev: _0x8e90d9,
  isAdmins: _0x594511,
  reply: _0x40eeee
}) => {
  try {
    const _0x472cc7 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x88d6b) {
      return _0x40eeee(_0x472cc7.only_gp);
    }
    if (!_0x594511) {
      const _0x2411d9 = {
        'quoted': _0x355fbd
      };
      if (!_0x8e90d9) {
        _0x40eeee(_0x472cc7.you_adm);
        return _0x2411d9;
      }
    }
    if (!_0x24571c) {
      return _0x40eeee(_0x472cc7.give_adm);
    }
    let _0x345955 = "💱 *HI ALL ! GIVE YOUR ATTENTION PLEASE* \n \n";
    for (let _0x8937a1 of _0x31686b) {
      _0x345955 += "> ᴅᴇᴀʀ ☣️ @" + _0x8937a1.id.split('@')[0x0] + "\n";
    }
    const _0x9c4934 = {
      'quoted': _0x355fbd
    };
    _0x4b7a1c.sendMessage(_0x43cf50, {
      'text': _0x345955,
      'mentions': _0x31686b.map(_0x2f0953 => _0x2f0953.id)
    }, _0x9c4934);
  } catch (_0x511eaf) {
    const _0x3be813 = {
      'text': '❌',
      'key': _0x355fbd.key
    };
    const _0x11890d = {
      'react': _0x3be813
    };
    await _0x4b7a1c.sendMessage(_0x43cf50, _0x11890d);
    console.log(_0x511eaf);
    _0x40eeee("❌ *Error Accurated !!*\n\n" + _0x511eaf);
  }
});
const _0x3220aa = {
  'pattern': "hidetag",
  'react': '🔊',
  'alias': ["tag", "f_tag"],
  'desc': "To Tag all Members for Message",
  'category': "group",
  'use': ".tag Hi",
  'filename': __filename
};
cmd(_0x3220aa, async (_0x101a30, _0x3470bb, _0x2d7d33, {
  from: _0x58bb66,
  l: _0x1ca49f,
  quoted: _0x58edb8,
  body: _0x6e7c1,
  isCmd: _0x38ae4f,
  command: _0x48672f,
  mentionByTag: _0x5acb96,
  args: _0x1d6a92,
  q: _0x43f681,
  isGroup: _0x351100,
  sender: _0x3115eb,
  senderNumber: _0x145528,
  botNumber2: _0x59e71b,
  botNumber: _0x220e3e,
  pushname: _0x29f641,
  isMe: _0x47d4e3,
  isOwner: _0x82d151,
  groupMetadata: _0x58afad,
  groupName: _0xbeee21,
  participants: _0x5a381b,
  groupAdmins: _0x330d81,
  isBotAdmins: _0x24643c,
  isCreator: _0x4ed033,
  isDev: _0x2f2923,
  isAdmins: _0xbdcb4,
  reply: _0x3798d6
}) => {
  try {
    const _0x4a181e = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x351100) {
      return _0x3798d6(_0x4a181e.only_gp);
    }
    if (!_0xbdcb4) {
      const _0x206ddc = {
        'quoted': _0x3470bb
      };
      if (!_0x2f2923) {
        _0x3798d6(_0x4a181e.you_adm);
        return _0x206ddc;
      }
    }
    if (!_0x24643c) {
      return _0x3798d6(_0x4a181e.give_adm);
    }
    if (!_0x43f681) {
      return _0x3798d6("*Please add a Message* ℹ️");
    }
    let _0x5cbff2 = '' + _0x43f681;
    const _0x2515b9 = {
      'quoted': _0x3470bb
    };
    _0x101a30.sendMessage(_0x58bb66, {
      'text': _0x5cbff2,
      'mentions': _0x5a381b.map(_0x301d5f => _0x301d5f.id)
    }, _0x2515b9);
  } catch (_0xc17467) {
    const _0x275155 = {
      'text': '❌',
      'key': _0x3470bb.key
    };
    const _0x3a041e = {
      'react': _0x275155
    };
    await _0x101a30.sendMessage(_0x58bb66, _0x3a041e);
    console.log(_0xc17467);
    _0x3798d6("❌ *Error Accurated !!*\n\n" + _0xc17467);
  }
});
const _0x446ca7 = {
  'pattern': "tagx",
  'react': '🔊',
  'alias': ['taggc', 'mentionall'],
  'desc': "To Tag all Members for Message",
  'category': "group",
  'use': ".tag Hi",
  'filename': __filename
};
cmd(_0x446ca7, async (_0x4ccc2b, _0x46df43, _0x157a68, {
  from: _0x4a3586,
  l: _0x1849a7,
  quoted: _0x49f20b,
  body: _0x289938,
  isCmd: _0x387e0e,
  command: _0x1d628a,
  mentionByTag: _0x4afa07,
  args: _0x1c76ca,
  q: _0x1b7262,
  isGroup: _0x134b12,
  sender: _0x3ddba6,
  senderNumber: _0x435739,
  botNumber2: _0x67152b,
  botNumber: _0x1a2845,
  pushname: _0x5aef84,
  isMe: _0x2b7832,
  isOwner: _0x356f37,
  groupMetadata: _0x3fc316,
  groupName: _0x14b7ff,
  participants: _0x2f6187,
  groupAdmins: _0x3a1e2e,
  isBotAdmins: _0x252cf3,
  isCreator: _0x284fda,
  isDev: _0xab165f,
  isAdmins: _0x2ec0d4,
  reply: _0x4bdb4a
}) => {
  try {
    if (!_0x157a68.quoted) {
      return _0x4bdb4a("*Please mention a message* ℹ️");
    }
    if (!_0x1b7262) {
      return _0x4bdb4a("*Please add a Group Jid* ℹ️");
    }
    let _0x5c2939 = '' + _0x157a68.quoted.msg;
    const _0x1dc222 = {
      'quoted': _0x46df43
    };
    _0x4ccc2b.sendMessage(_0x1b7262, {
      'text': _0x5c2939,
      'mentions': _0x2f6187.map(_0x7b549a => _0x7b549a.id)
    }, _0x1dc222);
  } catch (_0x1589ce) {
    const _0x58dd2e = {
      'text': '❌',
      'key': _0x46df43.key
    };
    const _0x3ec251 = {
      'react': _0x58dd2e
    };
    await _0x4ccc2b.sendMessage(_0x4a3586, _0x3ec251);
    console.log(_0x1589ce);
    _0x4bdb4a("❌ *Error Accurated !!*\n\n" + _0x1589ce);
  }
});
const _0x4c04aa = {
  'pattern': 'ginfo',
  'react': '🥏',
  'alias': ["groupinfo"],
  'desc': "Get group informations.",
  'category': "group",
  'use': ".ginfo",
  'filename': __filename
};
cmd(_0x4c04aa, async (_0x231979, _0x12b151, _0x116356, {
  from: _0x2d7057,
  l: _0x1f51d6,
  quoted: _0xfa3403,
  body: _0x4b72e9,
  isCmd: _0x40eeb4,
  command: _0x3805b6,
  args: _0x261d7b,
  q: _0x2663b3,
  isGroup: _0x14a404,
  sender: _0x36a844,
  senderNumber: _0xc77a65,
  botNumber2: _0xeebe6c,
  botNumber: _0xd4f7c,
  pushname: _0x47d89f,
  isMe: _0x34e197,
  isOwner: _0x5aed14,
  groupMetadata: _0x4c2ba5,
  groupName: _0x3145fd,
  participants: _0x2ef24c,
  groupAdmins: _0x333eb7,
  isBotAdmins: _0x246965,
  isCreator: _0x2ddfa0,
  isDev: _0x3d31de,
  isAdmins: _0x680b41,
  reply: _0x4db5ec
}) => {
  try {
    const _0x181fef = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x14a404) {
      return _0x4db5ec(_0x181fef.only_gp);
    }
    if (!_0x680b41) {
      const _0x21957c = {
        'quoted': _0x12b151
      };
      if (!_0x3d31de) {
        _0x4db5ec(_0x181fef.you_adm);
        return _0x21957c;
      }
    }
    if (!_0x246965) {
      return _0x4db5ec(_0x181fef.give_adm);
    }
    const _0x317a58 = await _0x231979.groupMetadata(_0x2d7057);
    let _0x6938e7 = await _0x231979.profilePictureUrl(_0x2d7057, "image");
    const _0x880de0 = "\n*" + _0x317a58.subject + "*\n\n🐉 *Group Jid* - " + _0x317a58.id + "\n\n📬 *Participant Count* - " + _0x317a58.size + "\n\n👤 *Group Creator* - " + _0x317a58.owner + "\n\n📃 *Group Description* - " + _0x317a58.desc + "\n\n";
    const _0x3e18be = {
      'url': _0x6938e7
    };
    const _0x3b6023 = {
      'quoted': _0x12b151
    };
    await _0x231979.sendMessage(_0x2d7057, {
      'image': _0x3e18be,
      'caption': _0x880de0 + config.FOOTER
    }, _0x3b6023);
  } catch (_0xb01bf8) {
    const _0x45b478 = {
      'text': '❌',
      'key': _0x12b151.key
    };
    const _0x49ee31 = {
      'react': _0x45b478
    };
    await _0x231979.sendMessage(_0x2d7057, _0x49ee31);
    console.log(_0xb01bf8);
    _0x4db5ec("❌ *Error Accurated !!*\n\n" + _0xb01bf8);
  }
});
