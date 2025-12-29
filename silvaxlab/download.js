const {
  fetchJson
} = require("../lib/functions");
const {
  downloadTiktok
} = require("@mrnima/tiktok-downloader");
const {
  facebook
} = require("@mrnima/facebook-downloader");
const cheerio = require("cheerio");
const {
  igdl
} = require("ruhend-scraper");
const axios = require("axios");
const {
  cmd,
  commands
} = require('../command');
cmd({
  'pattern': "tiktok3",
  'alias': ['tt3'],
  'react': '🎥',
  'desc': "download tt videos",
  'category': "download",
  'filename': __filename
}, async (_0x17ba40, _0x3e7702, _0x2a55b1, {
  from: _0x2af3cb,
  quoted: _0x5a90c5,
  body: _0x3b8f49,
  isCmd: _0x179688,
  command: _0x42362d,
  args: _0x31ccaa,
  q: _0x11bfff,
  isGroup: _0xdefcea,
  sender: _0x2542cf,
  senderNumber: _0x3aa611,
  botNumber2: _0x22057c,
  botNumber: _0x23b31a,
  pushname: _0x24af73,
  isMe: _0x3594b3,
  isOwner: _0x24a3e5,
  groupMetadata: _0x2466d5,
  groupName: _0x37e617,
  participants: _0x567e09,
  groupAdmins: _0x12f2aa,
  isBotAdmins: _0x5e033e,
  isAdmins: _0x497b76,
  reply: _0x5f3bbd
}) => {
  try {
    if (!_0x11bfff && !_0x11bfff.startsWith('https://')) {
      return _0x5f3bbd("*`Need url`*");
    }
    _0x2a55b1.react('⬇️');
    let _0x3f9407 = await downloadTiktok(_0x11bfff);
    let _0x4f6891 = "╭━━━〔 *⎝⧹ 𝑺𝒊𝒍𝒗𝒂 𝑺𝒑𝒂𝒓𝒌 𝑴𝑫 ⧸⎠* 〕━━━┈⊷\n┃▸╭───────────\n┃▸┃๏ *TIKTOK DOWNLOADER*\n┃▸└───────────···๏\n╰────────────────┈⊷\n╭━━━❐━⪼\n┇๏ *Title* - " + _0x3f9407.result.title + " \n╰━━━❐━⪼\n╭━❮ *Download Video* ❯━┈⊷\n┃▸╭─────────────·๏\n┃▸┃๏ *1*     ┃  *SD Quality*\n┃▸┃๏ *2*     ┃  *HD Quality*\n┃▸└────────────┈⊷\n╰━━━━━━━━━━━━━━━⪼\n╭━❮ *Download Audio* ❯━┈⊷\n┃▸╭─────────────·๏\n┃▸┃๏ *3*     ┃  *Audio*\n┃▸└────────────┈⊷\n╰━━━━━━━━━━━━━━━⪼\n> *©⎝⧹ 𝑺𝒊𝒍𝒗𝒂 𝑺𝒑𝒂𝒓𝒌 𝑴𝑫 ⧸⎠ ♡*";
    const _0x29dff7 = await _0x17ba40.sendMessage(_0x2af3cb, {
      'image': {
        'url': _0x3f9407.result.image
      },
      'caption': _0x4f6891
    });
    const _0x5e0151 = _0x29dff7.key.id;
    _0x17ba40.ev.on("messages.upsert", async _0x571114 => {
      const _0x55381c = _0x571114.messages[0x0];
      if (!_0x55381c.message) {
        return;
      }
      const _0x14072d = _0x55381c.message.conversation || _0x55381c.message.extendedTextMessage?.["text"];
      const _0x2029bb = _0x55381c.key.remoteJid;
      const _0x20da59 = _0x55381c.message.extendedTextMessage && _0x55381c.message.extendedTextMessage.contextInfo.stanzaId === _0x5e0151;
      if (_0x20da59) {
        await _0x17ba40.sendMessage(_0x2029bb, {
          'react': {
            'text': '⬇️',
            'key': _0x55381c.key
          }
        });
        let _0x27cf5f = _0x3f9407.result;
        await _0x17ba40.sendMessage(_0x2029bb, {
          'react': {
            'text': '⬆️',
            'key': _0x55381c.key
          }
        });
        if (_0x14072d === '1') {
          await _0x17ba40.sendMessage(_0x2029bb, {
            'video': {
              'url': _0x27cf5f.dl_link.download_mp4_1
            },
            'caption': "*©⎝⧹ 𝑺𝒊𝒍𝒗𝒂 𝑺𝒑𝒂𝒓𝒌 𝑴𝑫 ⧸⎠*"
          }, {
            'quoted': _0x55381c
          });
        } else {
          if (_0x14072d === '2') {
            await _0x17ba40.sendMessage(_0x2029bb, {
              'video': {
                'url': _0x27cf5f.dl_link.download_mp4_2
              },
              'caption': "*© ⎝⧹ 𝑺𝒊𝒍𝒗𝒂 𝑺𝒑𝒂𝒓𝒌 𝑴𝑫 ⧸⎠*"
            }, {
              'quoted': _0x55381c
            });
          } else if (_0x14072d === '3') {
            await _0x17ba40.sendMessage(_0x2029bb, {
              'audio': {
                'url': _0x27cf5f.dl_link.download_mp3
              },
              'mimetype': "audio/mpeg"
            }, {
              'quoted': _0x55381c
            });
          }
        }
      }
    });
  } catch (_0x1192a5) {
    console.log(_0x1192a5);
    _0x5f3bbd('' + _0x1192a5);
  }
});
cmd({
  'pattern': "twitter",
  'alias': ["tweet", 'twdl'],
  'desc': "Download Twitter videos",
  'category': 'download',
  'filename': __filename
}, async (_0x1b6730, _0x5e34ab, _0x465d61, {
  from: _0x530d47,
  quoted: _0x34cff8,
  body: _0x3eeb08,
  isCmd: _0x253322,
  command: _0x2bba29,
  args: _0x402b20,
  q: _0x424e48,
  isGroup: _0x2d88e4,
  sender: _0x350296,
  senderNumber: _0x309c27,
  botNumber2: _0x3ea1cc,
  botNumber: _0x42585a,
  pushname: _0x204c4a,
  isMe: _0x3896d9,
  isOwner: _0x397324,
  groupMetadata: _0x4c9a76,
  groupName: _0x6052fa,
  participants: _0x516df4,
  groupAdmins: _0x2a36f0,
  isBotAdmins: _0x28cc20,
  isAdmins: _0x395769,
  reply: _0x5d688c
}) => {
  try {
    if (!_0x424e48 || !_0x424e48.startsWith('https://')) {
      return _0x1b6730.sendMessage(_0x530d47, {
        'text': "❌ Please provide a valid Twitter URL."
      }, {
        'quoted': _0x5e34ab
      });
    }
    await _0x1b6730.sendMessage(_0x530d47, {
      'react': {
        'text': '⏳',
        'key': _0x5e34ab.key
      }
    });
    const _0x75168f = await axios.get("https://www.dark-yasiya-api.site/download/twitter?url=" + _0x424e48);
    const _0x2dd097 = _0x75168f.data;
    if (!_0x2dd097 || !_0x2dd097.status || !_0x2dd097.result) {
      return _0x465d61.reply("Failed to retrieve Twitter video. Please check the link and try again.");
    }
    const {
      desc: _0x1ee042,
      thumb: _0x5b0a7a,
      video_sd: _0x10c016,
      video_hd: _0x51b7f4
    } = _0x2dd097.result;
    const _0x2ec70f = await _0x1b6730.sendMessage(_0x530d47, {
      'image': {
        'url': _0x5b0a7a
      },
      'caption': "╭━━━〔 *⎝⧹ 𝑺𝒊𝒍𝒗𝒂 𝑺𝒑𝒂𝒓𝒌 𝑴𝑫 ⧸⎠* 〕━━━┈⊷\n┃▸╭───────────\n┃▸┃๏ *TWITTER DOWNLOADER*\n┃▸└───────────···๏\n╰────────────────┈⊷\n╭━❮ *Download Video* ❯━┈⊷\n┃▸╭─────────────·๏\n┃▸┃๏ *1.1*     ┃  *SD Quality*\n┃▸┃๏ *1.2*     ┃  *HD Quality*\n┃▸└────────────┈⊷\n╰━━━━━━━━━━━━━━━⪼\n╭━❮ *Download Audio* ❯━┈⊷\n┃▸╭─────────────·๏\n┃▸┃๏ *2.1*     ┃  *Audio*\n┃▸┃๏ *2.2*     ┃  *Document*\n┃▸┃๏ *2.3*     ┃  *Voice*\n┃▸└────────────┈⊷\n╰━━━━━━━━━━━━━━━⪼\n> *© ⎝⧹ 𝑺𝒊𝒍𝒗𝒂 𝑺𝒑𝒂𝒓𝒌 𝑴𝑫 ⧸⎠ ♡*"
    }, {
      'quoted': _0x5e34ab
    });
    const _0x201536 = _0x2ec70f.key.id;
    _0x1b6730.ev.on("messages.upsert", async _0x254226 => {
      const _0x4da097 = _0x254226.messages[0x0];
      if (!_0x4da097.message) {
        return;
      }
      const _0x111a51 = _0x4da097.message.conversation || _0x4da097.message.extendedTextMessage?.["text"];
      const _0x29bec7 = _0x4da097.key.remoteJid;
      const _0x38e788 = _0x4da097.message.extendedTextMessage && _0x4da097.message.extendedTextMessage.contextInfo.stanzaId === _0x201536;
      if (_0x38e788) {
        await _0x1b6730.sendMessage(_0x29bec7, {
          'react': {
            'text': '⬇️',
            'key': _0x4da097.key
          }
        });
        if (_0x111a51 === "1.1") {
          await _0x1b6730.sendMessage(_0x29bec7, {
            'video': {
              'url': _0x10c016
            },
            'caption': "*© ⎝⧹ 𝑺𝒊𝒍𝒗𝒂 𝑺𝒑𝒂𝒓𝒌 𝑴𝑫 ⧸⎠*"
          }, {
            'quoted': _0x4da097
          });
        } else {
          if (_0x111a51 === '1.2') {
            await _0x1b6730.sendMessage(_0x29bec7, {
              'video': {
                'url': _0x51b7f4
              },
              'caption': "*© ⎝⧹ 𝑺𝒊𝒍𝒗𝒂 𝑺𝒑𝒂𝒓𝒌 𝑴𝑫 ⧸⎠*"
            }, {
              'quoted': _0x4da097
            });
          } else {
            if (_0x111a51 === "2.1") {
              await _0x1b6730.sendMessage(_0x29bec7, {
                'audio': {
                  'url': _0x10c016
                },
                'mimetype': "audio/mpeg"
              }, {
                'quoted': _0x4da097
              });
            } else {
              if (_0x111a51 === "2.2") {
                await _0x1b6730.sendMessage(_0x29bec7, {
                  'document': {
                    'url': _0x10c016
                  },
                  'mimetype': "audio/mpeg",
                  'fileName': "SPARK/TWDL.mp3",
                  'caption': "*© ⎝⧹ 𝑺𝒊𝒍𝒗𝒂 𝑺𝒑𝒂𝒓𝒌 𝑴𝑫 ⧸⎠*"
                }, {
                  'quoted': _0x4da097
                });
              } else if (_0x111a51 === "2.3") {
                await _0x1b6730.sendMessage(_0x29bec7, {
                  'audio': {
                    'url': _0x10c016
                  },
                  'mimetype': "audio/mp4",
                  'ptt': true
                }, {
                  'quoted': _0x4da097
                });
              }
            }
          }
        }
      }
    });
  } catch (_0x58c9ee) {
    console.log(_0x58c9ee);
    _0x5d688c("An error occurred: " + _0x58c9ee);
  }
});
cmd({
  'pattern': 'mediafire',
  'alias': ["mfire"],
  'desc': "To download MediaFire files.",
  'react': '🎥',
  'category': 'download',
  'filename': __filename
}, async (_0xc60242, _0x56b9bd, _0x1d4064, {
  from: _0x3eb310,
  quoted: _0x4cba07,
  body: _0x4b648,
  isCmd: _0x2a96f2,
  command: _0x468ea8,
  args: _0x406c44,
  q: _0x17ee78,
  isGroup: _0x483c91,
  sender: _0x510aa1,
  senderNumber: _0x33fe01,
  botNumber2: _0x45b464,
  botNumber: _0xf63b78,
  pushname: _0x3f038c,
  isMe: _0x44506d,
  isOwner: _0x27bda7,
  groupMetadata: _0x1aeab2,
  groupName: _0x2dd13e,
  participants: _0x5e38a2,
  groupAdmins: _0x364a5d,
  isBotAdmins: _0x307bb0,
  isAdmins: _0x59b66c,
  reply: _0x3fc41a
}) => {
  try {
    if (!_0x17ee78) {
      return _0x1d4064.reply("Please provide a valid MediaFire link.");
    }
    _0x1d4064.react('⬇️');
    const _0x670fc1 = await axios.get("https://www.dark-yasiya-api.site/download/mfire?url=" + _0x17ee78);
    const _0x2a62ec = _0x670fc1.data;
    if (!_0x2a62ec || !_0x2a62ec.status || !_0x2a62ec.result || !_0x2a62ec.result.dl_link) {
      return _0x1d4064.reply("Failed to fetch MediaFire download link. Ensure the link is valid and public.");
    }
    const _0x338997 = _0x2a62ec.result.dl_link;
    const _0x10a817 = _0x2a62ec.result.fileName || "mediafire_download";
    const _0x259baa = _0x2a62ec.result.fileType || "application/octet-stream";
    _0x1d4064.react('⬆️');
    let _0x4ad462 = "╭━━━〔 *⎝⧹ 𝑺𝒊𝒍𝒗𝒂 𝑺𝒑𝒂𝒓𝒌 𝑴𝑫 ⧸⎠* 〕━━━┈⊷\n┃▸╭───────────\n┃▸┃๏ *MFIRE DOWNLOADER*\n┃▸└───────────···๏\n╰────────────────┈⊷\n╭━━━❐━⪼\n┇๏ *File Name* - " + _0x10a817 + " \n┇๏ *File Type* - " + _0x259baa + " \n╰━━━❐━⪼\n> *© ⎝⧹ 𝑺𝒊𝒍𝒗𝒂 𝑺𝒑𝒂𝒓𝒌 𝑴𝑫 ⧸⎠ ♡*";
    await _0xc60242.sendMessage(_0x3eb310, {
      'document': {
        'url': _0x338997
      },
      'mimetype': _0x259baa,
      'fileName': _0x10a817,
      'caption': _0x4ad462
    }, {
      'quoted': _0x56b9bd
    });
  } catch (_0x55f937) {
    console.error(_0x55f937);
    _0x3fc41a("An error occurred: " + _0x55f937.message);
  }
});
cmd({
  'pattern': 'ig',
  'alias': ["insta", "Instagram"],
  'desc': "To download instagram videos.",
  'react': '🎥',
  'category': "download",
  'filename': __filename
}, async (_0x37f725, _0x489a1e, _0x150743, {
  from: _0x41a867,
  quoted: _0x420889,
  body: _0x3446d4,
  isCmd: _0x5e7ca9,
  command: _0x287ec1,
  args: _0x1f6906,
  q: _0x3be185,
  isGroup: _0x14506e,
  sender: _0xe2d502,
  senderNumber: _0x18bb0c,
  botNumber2: _0x24d3b9,
  botNumber: _0x2d3cae,
  pushname: _0x2b6cdf,
  isMe: _0x182762,
  isOwner: _0x2baf9c,
  groupMetadata: _0x16aaa8,
  groupName: _0x42b083,
  participants: _0x5b1a48,
  groupAdmins: _0x497c62,
  isBotAdmins: _0x3a233c,
  isAdmins: _0x3fa458,
  reply: _0x4edbb2
}) => {
  try {
    if (!_0x3be185) {
      return _0x150743.reply("Please Give Me a vaild Link...");
    }
    _0x150743.react('⬇️');
    let _0x3507e0 = await igdl(_0x3be185);
    let _0x2d751d = await _0x3507e0.data;
    for (let _0x9567ff = 0x0; _0x9567ff < 0x14; _0x9567ff++) {
      let _0x22bee3 = _0x2d751d[_0x9567ff];
      let _0x495822 = _0x22bee3.url;
      _0x150743.react('⬆️');
      await _0x37f725.sendMessage(_0x41a867, {
        'video': {
          'url': _0x495822
        },
        'mimetype': 'video/mp4',
        'caption': "> *© ⎝⧹ 𝑺𝒊𝒍𝒗𝒂 𝑺𝒑𝒂𝒓𝒌 𝑴𝑫 ⧸⎠*"
      }, {
        'quoted': _0x489a1e
      });
      _0x150743.react('✅');
    }
  } catch (_0x56d1cc) {
    console.log(_0x56d1cc);
  }
});
async function xdl(_0x3d2536) {
  return new Promise((_0x3c677f, _0x3b4b2e) => {
    fetch('' + _0x3d2536, {
      'method': "get"
    }).then(_0x5da93a => _0x5da93a.text()).then(_0x36604b => {
      const _0x3ac5be = cheerio.load(_0x36604b, {
        'xmlMode': false
      });
      const _0x3db906 = _0x3ac5be("meta[property=\"og:title\"]").attr("content");
      const _0x2faa2a = _0x3ac5be("meta[property=\"og:duration\"]").attr("content");
      const _0x5d0c84 = _0x3ac5be("meta[property=\"og:image\"]").attr("content");
      const _0x2be2a4 = _0x3ac5be("meta[property=\"og:video:type\"]").attr('content');
      const _0x503e28 = _0x3ac5be("meta[property=\"og:video:width\"]").attr("content");
      const _0x4e322e = _0x3ac5be("meta[property=\"og:video:height\"]").attr("content");
      const _0x17839d = _0x3ac5be('span.metadata').text();
      const _0x3d1c95 = _0x3ac5be("#video-player-bg > script:nth-child(6)").html();
      const _0x519722 = {
        'low': (_0x3d1c95.match("html5player.setVideoUrlLow\\('(.*?)'\\);") || [])[0x1],
        'high': _0x3d1c95.match("html5player.setVideoUrlHigh\\('(.*?)'\\);" || [])[0x1],
        'HLS': _0x3d1c95.match("html5player.setVideoHLS\\('(.*?)'\\);" || [])[0x1],
        'thumb': _0x3d1c95.match("html5player.setThumbUrl\\('(.*?)'\\);" || [])[0x1],
        'thumb69': _0x3d1c95.match("html5player.setThumbUrl169\\('(.*?)'\\);" || [])[0x1],
        'thumbSlide': _0x3d1c95.match("html5player.setThumbSlide\\('(.*?)'\\);" || [])[0x1],
        'thumbSlideBig': _0x3d1c95.match("html5player.setThumbSlideBig\\('(.*?)'\\);" || [])[0x1]
      };
      _0x3c677f({
        'status': true,
        'result': {
          'title': _0x3db906,
          'URL': _0x3d2536,
          'duration': _0x2faa2a,
          'image': _0x5d0c84,
          'videoType': _0x2be2a4,
          'videoWidth': _0x503e28,
          'videoHeight': _0x4e322e,
          'info': _0x17839d,
          'files': _0x519722
        }
      });
    })["catch"](_0x3cd887 => _0x3b4b2e({
      'status': false,
      'result': _0x3cd887
    }));
  });
}
cmd({
  'pattern': "xnxxdown",
  'alias': ["dlxnxx", "xnxxdl"],
  'react': '🫣',
  'desc': "Download xnxx videos",
  'category': "nsfw",
  'use': ".xnxx <xnxx link>",
  'filename': __filename
}, async (_0x486161, _0x455e73, _0x44e403, {
  from: _0x1ed280,
  l: _0xd5ac3b,
  quoted: _0x50d06e,
  body: _0xbf6335,
  isCmd: _0x77414e,
  command: _0x2a4087,
  args: _0x3eac74,
  q: _0x47028d,
  isGroup: _0x1ee1f5,
  sender: _0x889d22,
  senderNumber: _0x1aa706,
  botNumber2: _0x48376c,
  botNumber: _0xd92db2,
  pushname: _0x2e4259,
  isMe: _0x1b3a4e,
  isOwner: _0x1f2f15,
  groupMetadata: _0x36a1cb,
  groupName: _0xe67509,
  participants: _0x441600,
  groupAdmins: _0x2a95d5,
  isBotAdmins: _0x4fc5ae,
  isAdmins: _0x2e06a2,
  reply: _0x5685d0
}) => {
  try {
    if (!_0x47028d) {
      return _0x5685d0("*Please give me url !!*");
    }
    let _0x3a9391 = await xdl(_0x47028d);
    let _0x340eb7 = _0x3a9391.result.title;
    await _0x486161.sendMessage(_0x1ed280, {
      'video': {
        'url': _0x3a9391.result.files.high
      },
      'caption': _0x340eb7
    }, {
      'quoted': _0x455e73
    });
  } catch (_0x1ee92f) {
    _0x5685d0("*Error !!*");
    console.log(_0x1ee92f);
  }
});
cmd({
  'pattern': "xvdown",
  'alias': ["dlxv", 'xvdl'],
  'react': '🫣',
  'desc': "Download xvideos videos",
  'category': 'nsfw',
  'use': ".xv <xvideos link>",
  'filename': __filename
}, async (_0xf4b747, _0x2d8700, _0xb5ff80, {
  from: _0x2747f2,
  l: _0x28ada0,
  quoted: _0x1a14ba,
  body: _0x132b6b,
  isCmd: _0x31fc41,
  command: _0x125d37,
  args: _0x3e211e,
  q: _0x17784d,
  isGroup: _0x4aae41,
  sender: _0x435ff6,
  senderNumber: _0x519f66,
  botNumber2: _0x5905f1,
  botNumber: _0x295843,
  pushname: _0xd89eca,
  isMe: _0x4cb90b,
  isOwner: _0x311d1b,
  groupMetadata: _0x11b721,
  groupName: _0x1668e8,
  participants: _0x3340c2,
  groupAdmins: _0x450bd7,
  isBotAdmins: _0x52033f,
  isAdmins: _0x37a118,
  reply: _0x221664
}) => {
  try {
    if (!_0x17784d) {
      return _0x221664("*Please give me url !!*");
    }
    let _0x1c083d = await fetchJson('https://www.dark-yasiya-api.site/download/xvideo?url=' + _0x17784d);
    const _0x40cfc2 = "\n   🔞 *⎝⧹ 𝑺𝒊𝒍𝒗𝒂 𝑺𝒑𝒂𝒓𝒌 𝑴𝑫 ⧸⎠ XVIDEO DOWNLOADER* 🔞\n\n     \n• *Title* - " + _0x1c083d.result.title + "\n\n• *Views* - " + _0x1c083d.result.views + "\n\n• *Like* - " + _0x1c083d.result.like + "\n\n• *Deslike* - " + _0x1c083d.result.deslike + "\n\n• *Size* - " + _0x1c083d.result.size;
    await _0xf4b747.sendMessage(_0x2747f2, {
      'video': {
        'url': _0x1c083d.result.dl_link
      },
      'caption': _0x40cfc2
    }, {
      'quoted': _0x2d8700
    });
  } catch (_0x302040) {
    _0x221664("*Error !!*");
    console.log(_0x302040);
  }
});
const fs = require('fs');
const path = require('path');
cmd({
  'pattern': "baiscope",
  'alias': ["movie2"],
  'react': '📑',
  'category': 'download',
  'desc': "baiscope.lk",
  'filename': __filename
}, async (_0x29f25e, _0x5a1475, _0x23f4fe, {
  from: _0x16270b,
  q: _0x234c71,
  isDev: _0x5a061f,
  reply: _0x2e05d8
}) => {
  try {
    if (!_0x234c71) {
      return await _0x2e05d8("*Please provide a search query! (e.g., Avatar)*");
    }
    const _0x565da1 = "https://www.baiscope.lk/?s=" + encodeURIComponent(_0x234c71);
    const _0x2f6b7f = await axios.get(_0x565da1);
    const _0x55938d = cheerio.load(_0x2f6b7f.data);
    let _0x2a128a = [];
    _0x55938d("article.elementor-post").each((_0xc4379d, _0x58132b) => {
      const _0x3c98a9 = _0x55938d(_0x58132b).find("h5.elementor-post__title > a").text().trim();
      const _0x4f6c46 = _0x55938d(_0x58132b).find("h5.elementor-post__title > a").attr("href");
      const _0x227928 = _0x55938d(_0x58132b).find(".elementor-post__thumbnail img").attr("src");
      if (_0x3c98a9 && _0x4f6c46 && _0x227928) {
        _0x2a128a.push({
          'title': _0x3c98a9,
          'episodeLink': _0x4f6c46,
          'imgUrl': _0x227928
        });
      }
    });
    if (_0x2a128a.length === 0x0) {
      return await _0x2e05d8("No results found for: " + _0x234c71);
    }
    let _0x159726 = "📺 Search Results for *" + _0x234c71 + ":*\n\n";
    _0x2a128a.forEach((_0x43023e, _0x261b1f) => {
      _0x159726 += '*' + (_0x261b1f + 0x1) + ".* " + _0x43023e.title + "\n🔗 Link: " + _0x43023e.episodeLink + "\n\n";
    });
    const _0x390294 = await _0x29f25e.sendMessage(_0x16270b, {
      'text': _0x159726
    }, {
      'quoted': _0x23f4fe
    });
    const _0x1c3498 = _0x390294.key.id;
    _0x29f25e.ev.on("messages.upsert", async _0x42363d => {
      const _0x9a9db9 = _0x42363d.messages[0x0];
      if (!_0x9a9db9.message) {
        return;
      }
      const _0x19512a = _0x9a9db9.message.conversation || _0x9a9db9.message.extendedTextMessage?.["text"];
      const _0x44c1ea = _0x9a9db9.key.remoteJid;
      const _0x1eb2ca = _0x9a9db9.message.extendedTextMessage && _0x9a9db9.message.extendedTextMessage.contextInfo.stanzaId === _0x1c3498;
      if (_0x1eb2ca) {
        const _0x1fc120 = parseInt(_0x19512a.trim());
        if (!isNaN(_0x1fc120) && _0x1fc120 > 0x0 && _0x1fc120 <= _0x2a128a.length) {
          const _0x339cc7 = _0x2a128a[_0x1fc120 - 0x1];
          const _0x49062b = await axios.get(_0x339cc7.episodeLink);
          const _0x4ae66c = cheerio.load(_0x49062b.data);
          const _0x50c0f3 = _0x4ae66c("a.dlm-buttons-button").attr("href");
          if (_0x50c0f3) {
            await _0x29f25e.sendMessage(_0x44c1ea, {
              'image': {
                'url': _0x339cc7.imgUrl
              },
              'caption': "🎬 *" + _0x339cc7.title + "*\n🔗 Link: " + _0x339cc7.episodeLink + "\n⬇️ Download will follow."
            }, {
              'quoted': _0x9a9db9
            });
            const _0xede861 = path.join(__dirname, "downloaded_episode.zip");
            const _0x568fbb = fs.createWriteStream(_0xede861);
            const _0x296eaf = await axios({
              'url': _0x50c0f3,
              'method': "GET",
              'responseType': "stream"
            });
            _0x296eaf.data.pipe(_0x568fbb);
            _0x568fbb.on("finish", async () => {
              await _0x29f25e.sendMessage(_0x44c1ea, {
                'document': {
                  'url': _0xede861
                },
                'mimetype': 'application/zip',
                'fileName': _0x339cc7.title + ".zip",
                'caption': '*' + _0x339cc7.title + "*\n\n> Lααɾα-ᴍᴅ ✻"
              }, {
                'quoted': _0x9a9db9
              });
              fs.unlinkSync(_0xede861);
            });
            _0x568fbb.on("error", _0x5e5593 => {
              console.error("Error downloading ZIP file:", _0x5e5593);
              _0x2e05d8("*Error downloading the episode ZIP file.*");
            });
          } else {
            await _0x2e05d8("*Download link not found for the selected episode.*");
          }
        } else {
          await _0x2e05d8("*Invalid selection. Please choose a valid number.*");
        }
      }
    });
  } catch (_0x13a142) {
    console.error(_0x13a142);
    await _0x2e05d8("*An error occurred while scraping the data.*");
  }
});
cmd({
  'pattern': "ginisisila",
  'react': '📑',
  'category': 'download',
  'desc': "ginisisilacartoon.net",
  'filename': __filename
}, async (_0x2193c1, _0x46b55a, _0x1da9d5, {
  from: _0x49af42,
  q: _0x269b23,
  isDev: _0x11a405,
  reply: _0x5bc5f9
}) => {
  try {
    if (!_0x269b23) {
      return await _0x5bc5f9("*Please provide a search query! (e.g., Garfield)*");
    }
    const _0x47bcff = "https://ginisisilacartoon.net/search.php?q=" + encodeURIComponent(_0x269b23);
    const _0x942373 = await axios.get(_0x47bcff);
    const _0x8a6b01 = cheerio.load(_0x942373.data);
    let _0x4981e5 = [];
    _0x8a6b01("div.inner-video-cell").each((_0x401c60, _0x3494b2) => {
      const _0x556af6 = _0x8a6b01(_0x3494b2).find("div.video-title > a").attr('title');
      const _0x3356b4 = _0x8a6b01(_0x3494b2).find("div.posted-time").text().trim();
      const _0x124102 = _0x8a6b01(_0x3494b2).find("div.video-title > a").attr("href");
      const _0x10a7c3 = _0x8a6b01(_0x3494b2).find("div.inner-video-thumb-wrapper img").attr('src');
      if (_0x556af6 && _0x124102) {
        _0x4981e5.push({
          'title': _0x556af6,
          'postedTime': _0x3356b4,
          'episodeLink': 'https://ginisisilacartoon.net/' + _0x124102,
          'imageUrl': _0x10a7c3
        });
      }
    });
    if (_0x4981e5.length === 0x0) {
      return await _0x5bc5f9("No results found for: " + _0x269b23);
    }
    let _0x243034 = "📺 Search Results for *" + _0x269b23 + ":*\n\n";
    _0x4981e5.forEach((_0xb47ad9, _0x566538) => {
      _0x243034 += '*' + (_0x566538 + 0x1) + ".* " + _0xb47ad9.title + "\n🗓️ Posted: " + _0xb47ad9.postedTime + "\n🔗 Link: " + _0xb47ad9.episodeLink + "\n\n";
    });
    const _0x338e95 = await _0x2193c1.sendMessage(_0x49af42, {
      'text': _0x243034
    }, {
      'quoted': _0x1da9d5
    });
    const _0x10da7c = _0x338e95.key.id;
    _0x2193c1.ev.on("messages.upsert", async _0x391edd => {
      const _0x50c272 = _0x391edd.messages[0x0];
      if (!_0x50c272.message) {
        return;
      }
      const _0x18f109 = _0x50c272.message.conversation || _0x50c272.message.extendedTextMessage?.["text"];
      const _0x51f5e6 = _0x50c272.key.remoteJid;
      const _0x45542b = _0x50c272.message.extendedTextMessage && _0x50c272.message.extendedTextMessage.contextInfo.stanzaId === _0x10da7c;
      if (_0x45542b) {
        const _0x134e52 = parseInt(_0x18f109.trim());
        if (!isNaN(_0x134e52) && _0x134e52 > 0x0 && _0x134e52 <= _0x4981e5.length) {
          const _0x5ad7ef = _0x4981e5[_0x134e52 - 0x1];
          const _0x1165ac = "*🪄 ɴᴀᴍᴇ:-* " + _0x5ad7ef.title + "\n⏳ *ᴅᴀᴛᴇ:-* " + _0x5ad7ef.postedTime + "\n📎 *ᴇᴘɪꜱᴏᴅᴇ ʟɪɴᴋ*:- " + _0x5ad7ef.episodeLink + "\n\n☘ *We are uploading the Movie/Episode you requested.*";
          const _0x283018 = {
            'image': {
              'url': _0x5ad7ef.imageUrl
            },
            'caption': _0x1165ac
          };
          await _0x2193c1.sendMessage(_0x51f5e6, _0x283018, {
            'quoted': _0x50c272
          });
          const _0x3888e9 = await axios.get(_0x5ad7ef.episodeLink);
          const _0x517e63 = cheerio.load(_0x3888e9.data);
          const _0xecfa53 = _0x517e63("div#player-holder iframe").attr("src");
          if (_0xecfa53) {
            const _0x3e5b86 = "https://api.fgmods.xyz/api/downloader/gdrive?url=" + _0xecfa53 + "&apikey=mnp3grlZ";
            try {
              const _0x53c0cc = await axios.get(_0x3e5b86);
              const _0x13e7a7 = _0x53c0cc.data.result.downloadUrl;
              if (_0x13e7a7) {
                await _0x2193c1.sendMessage(_0x51f5e6, {
                  'document': {
                    'url': _0x13e7a7
                  },
                  'mimetype': "video/mp4",
                  'fileName': "MR JAWAD | " + _0x5ad7ef.title + ".mp4",
                  'caption': _0x5ad7ef.title + " | *© ⎝⧹ 𝑺𝒊𝒍𝒗𝒂 𝑺𝒑𝒂𝒓𝒌 𝑴𝑫 ⧸⎠*"
                }, {
                  'quoted': _0x50c272
                });
              } else {
                await _0x5bc5f9("Failed to retrieve the download link for this episode.");
              }
            } catch (_0x228fee) {
              console.error("Error fetching the download link:", _0x228fee);
              await _0x5bc5f9("An error occurred while trying to fetch the download link.");
            }
          } else {
            await _0x5bc5f9("No downloadable link found for this episode.");
          }
        } else {
          await _0x5bc5f9("Please reply with a valid number from the list.");
        }
      }
    });
  } catch (_0x285e41) {
    _0x5bc5f9("*Error occurred while scraping!*");
    console.error(_0x285e41);
  }
});
cmd({
  'pattern': "apk",
  'desc': "Download apk.",
  'category': "download",
  'filename': __filename
}, async (_0x34e5dd, _0x17467d, _0x43d4c5, {
  from: _0x23d582,
  quoted: _0x134ddc,
  body: _0x4fc311,
  isCmd: _0x410690,
  command: _0x5084aa,
  args: _0x3080f8,
  q: _0x30273e,
  isGroup: _0x43bf4c,
  sender: _0xbfe55b,
  senderNumber: _0x1ee891,
  botNumber2: _0x26b044,
  botNumber: _0x2f596a,
  pushname: _0x2d68d2,
  isMe: _0x5c6a0e,
  isOwner: _0x1d1336,
  groupMetadata: _0x3b2e64,
  groupName: _0x3fd919,
  participants: _0x18345b,
  groupAdmins: _0x1ab021,
  isBotAdmins: _0xb86864,
  isAdmins: _0x1215c0,
  reply: _0x1f8220
}) => {
  try {
    await _0x43d4c5.react('⬇');
    const _0x22a92f = 'http://ws75.aptoide.com/api/7/apps/search/query=' + _0x30273e + "/limit=1";
    const _0x4fde7e = await axios.get(_0x22a92f);
    const _0x10c997 = _0x4fde7e.data;
    let _0xd2bf2d = _0x10c997.datalist.list[0x0].size % 0xf4240;
    let _0x59ba6b = '.' + _0xd2bf2d;
    let _0x5ba56e = _0x10c997.datalist.list[0x0].size / 0xf4240;
    let _0x24e318 = _0x5ba56e - _0x59ba6b;
    let _0x5d8f45 = "╭━━━〔 *⎝⧹ 𝑺𝒊𝒍𝒗𝒂 𝑺𝒑𝒂𝒓𝒌 𝑴𝑫 ⧸⎠* 〕━━━┈⊷\n┃▸╭───────────\n┃▸┃๏ *APK DOWNLOADER*\n┃▸└───────────···๏\n╰────────────────┈⊷\n╭━━━❐━⪼\n┇๏ *Name* - " + _0x10c997.datalist.list[0x0].name + " \n┇๏ *Size* - " + _0x24e318 + "MB \n┇๏ *Package* - " + _0x10c997.datalist.list[0x0]['package'] + " \n┇๏ *Updated On* - " + _0x10c997.datalist.list[0x0].updated + " \n┇๏ *Developer* - " + _0x10c997.datalist.list[0x0].developer.name + " \n╰━━━❐━⪼\n> *© ⎝⧹ 𝑺𝒊𝒍𝒗𝒂 𝑺𝒑𝒂𝒓𝒌 𝑴𝑫 ⧸⎠ ♡*";
    await _0x43d4c5.react('⬆');
    await _0x34e5dd.sendMessage(_0x23d582, {
      'document': {
        'url': _0x10c997.datalist.list[0x0].file.path_alt
      },
      'fileName': _0x10c997.datalist.list[0x0].name,
      'mimetype': "application/vnd.android.package-archive",
      'caption': _0x5d8f45
    }, {
      'quoted': _0x17467d
    });
    await _0x43d4c5.react('✅');
  } catch (_0x472ce9) {
    console.log(_0x472ce9);
    _0x1f8220('' + _0x472ce9);
  }
});
const {
  sinhalaSub
} = require("mrnima-moviedl");
cmd({
  'pattern': "sinhalasub",
  'alias': ['movie'],
  'react': '📑',
  'category': "download",
  'desc': "Search movies on sinhalasub and get download links",
  'filename': __filename
}, async (_0x57388a, _0x25908f, _0x5a7bbb, {
  from: _0x5f00ab,
  q: _0x522a3c,
  reply: _0x371d5f
}) => {
  try {
    if (!_0x522a3c) {
      return await _0x371d5f("*Please provide a search query! (e.g., Deadpool)*");
    }
    var _0x24d368 = await sinhalaSub();
    const _0x5c5824 = await _0x24d368.search(_0x522a3c);
    const _0x5959f9 = _0x5c5824.result.slice(0x0, 0xa);
    if (!_0x5959f9 || _0x5959f9.length === 0x0) {
      return await _0x371d5f("No results found for: " + _0x522a3c);
    }
    let _0x5a71c6 = "📽️ *Search Results for* \"" + _0x522a3c + "\":\n\n";
    _0x5959f9.forEach((_0x203df6, _0x1152d7) => {
      _0x5a71c6 += '*' + (_0x1152d7 + 0x1) + ".* " + _0x203df6.title + "\n🔗 Link: " + _0x203df6.link + "\n\n";
    });
    const _0x3469d1 = await _0x57388a.sendMessage(_0x5f00ab, {
      'text': _0x5a71c6
    }, {
      'quoted': _0x5a7bbb
    });
    const _0x2c39e3 = _0x3469d1.key.id;
    _0x57388a.ev.on('messages.upsert', async _0xf4885f => {
      const _0x5703e1 = _0xf4885f.messages[0x0];
      if (!_0x5703e1.message) {
        return;
      }
      const _0x1508b9 = _0x5703e1.message.conversation || _0x5703e1.message.extendedTextMessage?.["text"];
      const _0x55d809 = _0x5703e1.message.extendedTextMessage && _0x5703e1.message.extendedTextMessage.contextInfo.stanzaId === _0x2c39e3;
      if (_0x55d809) {
        const _0x3df263 = parseInt(_0x1508b9.trim());
        if (!isNaN(_0x3df263) && _0x3df263 > 0x0 && _0x3df263 <= _0x5959f9.length) {
          const _0xa22e01 = _0x5959f9[_0x3df263 - 0x1];
          const _0x51f8f0 = 'https://api-site-2.vercel.app/api/sinhalasub/movie?url=' + encodeURIComponent(_0xa22e01.link);
          try {
            const _0x64ea0c = await axios.get(_0x51f8f0);
            const _0x5469b6 = _0x64ea0c.data.result;
            const _0x291aac = _0x5469b6.dl_links || [];
            if (_0x291aac.length === 0x0) {
              return await _0x371d5f("No PixelDrain links found.");
            }
            let _0x4ccef6 = "🎥 *" + _0x5469b6.title + "*\n\n";
            _0x4ccef6 += "*Available PixelDrain Download Links:*\n";
            _0x291aac.forEach((_0x66c253, _0x299595) => {
              _0x4ccef6 += '*' + (_0x299595 + 0x1) + ".* " + _0x66c253.quality + " - " + _0x66c253.size + "\n🔗 Link: " + _0x66c253.link + "\n\n";
            });
            const _0xb3a0bf = await _0x57388a.sendMessage(_0x5f00ab, {
              'text': _0x4ccef6
            }, {
              'quoted': _0x5703e1
            });
            const _0x50fb94 = _0xb3a0bf.key.id;
            _0x57388a.ev.on("messages.upsert", async _0x59cf50 => {
              const _0x267b62 = _0x59cf50.messages[0x0];
              if (!_0x267b62.message) {
                return;
              }
              const _0x2dcf80 = _0x267b62.message.conversation || _0x267b62.message.extendedTextMessage?.["text"];
              const _0x2a3361 = _0x267b62.message.extendedTextMessage && _0x267b62.message.extendedTextMessage.contextInfo.stanzaId === _0x50fb94;
              if (_0x2a3361) {
                const _0x48bb68 = parseInt(_0x2dcf80.trim());
                if (!isNaN(_0x48bb68) && _0x48bb68 > 0x0 && _0x48bb68 <= _0x291aac.length) {
                  const _0x21b2a8 = _0x291aac[_0x48bb68 - 0x1];
                  const _0x207ee5 = _0x21b2a8.link.split('/').pop();
                  await _0x57388a.sendMessage(_0x5f00ab, {
                    'react': {
                      'text': '⬇️',
                      'key': _0x5a7bbb.key
                    }
                  });
                  const _0x56e5a4 = "https://pixeldrain.com/api/file/" + _0x207ee5;
                  await _0x57388a.sendMessage(_0x5f00ab, {
                    'react': {
                      'text': '⬆',
                      'key': _0x5a7bbb.key
                    }
                  });
                  await _0x57388a.sendMessage(_0x5f00ab, {
                    'document': {
                      'url': _0x56e5a4
                    },
                    'mimetype': "video/mp4",
                    'fileName': _0x5469b6.title + " - " + _0x21b2a8.quality + ".mp4",
                    'caption': _0x5469b6.title + "\nQuality: " + _0x21b2a8.quality + "\nPowered by SinhalaSub",
                    'contextInfo': {
                      'mentionedJid': [],
                      'externalAdReply': {
                        'title': _0x5469b6.title,
                        'body': "⎝⧹ 𝑺𝒊𝒍𝒗𝒂 𝑺𝒑𝒂𝒓𝒌 𝑴𝑫 ⧸⎠",
                        'mediaType': 0x1,
                        'sourceUrl': _0xa22e01.link,
                        'thumbnailUrl': _0x5469b6.image
                      }
                    }
                  }, {
                    'quoted': _0x267b62
                  });
                  await _0x57388a.sendMessage(_0x5f00ab, {
                    'react': {
                      'text': '✅',
                      'key': _0x5a7bbb.key
                    }
                  });
                } else {
                  await _0x371d5f("Invalid selection. Please reply with a valid number.");
                }
              }
            });
          } catch (_0x105a5c) {
            console.error("Error fetching movie details:", _0x105a5c);
            await _0x371d5f("An error occurred while fetching movie details. Please try again.");
          }
        } else {
          await _0x371d5f("Invalid selection. Please reply with a valid number.");
        }
      }
    });
  } catch (_0x29d828) {
    console.error("Error during search:", _0x29d828);
    _0x371d5f("*An error occurred while searching!*");
  }
});
cmd({
  'pattern': "gdrive",
  'desc': "To download Gdrive files.",
  'react': '🌐',
  'category': "download",
  'filename': __filename
}, async (_0x597ff7, _0x13f4cd, _0x276591, {
  from: _0xf9cfb6,
  quoted: _0x3c87e1,
  body: _0x1f0c41,
  isCmd: _0xbf3628,
  command: _0x411f00,
  args: _0x22c9e1,
  q: _0x18db41,
  isGroup: _0x48d9b5,
  sender: _0x556716,
  senderNumber: _0x2f5b0a,
  botNumber2: _0x1b3639,
  botNumber: _0x366fc8,
  pushname: _0x39afea,
  isMe: _0x16b971,
  isOwner: _0x55a48b,
  groupMetadata: _0x45052b,
  groupName: _0x5354f4,
  participants: _0x58543a,
  groupAdmins: _0x803c3,
  isBotAdmins: _0x205fd8,
  isAdmins: _0x3dce84,
  reply: _0x465492
}) => {
  try {
    await _0x597ff7.sendMessage(_0xf9cfb6, {
      'react': {
        'text': '⬇️',
        'key': _0x13f4cd.key
      }
    });
    if (!_0x18db41) {
      return _0x276591.reply("Please Give Me a vaild Link...");
    }
    const _0x54edc1 = "https://api.fgmods.xyz/api/downloader/gdrive?url=" + _0x18db41 + "&apikey=mnp3grlZ";
    const _0x530ff0 = await axios.get(_0x54edc1);
    const _0x3e031d = _0x530ff0.data.result.downloadUrl;
    if (_0x3e031d) {
      await _0x597ff7.sendMessage(_0xf9cfb6, {
        'react': {
          'text': '⬆️',
          'key': _0x13f4cd.key
        }
      });
      await _0x597ff7.sendMessage(_0xf9cfb6, {
        'document': {
          'url': _0x3e031d
        },
        'mimetype': _0x530ff0.data.result.mimetype,
        'fileName': _0x530ff0.data.result.fileName,
        'caption': "*© ⎝⧹ 𝑺𝒊𝒍𝒗𝒂 𝑺𝒑𝒂𝒓𝒌 𝑴𝑫 ⧸⎠"
      }, {
        'quoted': _0x13f4cd
      });
    }
    await _0x597ff7.sendMessage(_0xf9cfb6, {
      'react': {
        'text': '✅',
        'key': _0x13f4cd.key
      }
    });
  } catch (_0x5d813c) {
    console.log(_0x5d813c);
  }
});
