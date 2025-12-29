const {
  cmd,
  commands
} = require('../command');
const yts = require('yt-search');
const {
  fetchJson
} = require("../lib/functions");
const axios = require("axios");
async function ytmp4(_0x2f6b39, _0x42c817) {
  try {
    if (!_0x2f6b39 || !_0x42c817) {
      throw new Error("url and format parameters are required.");
    }
    const _0x4736a2 = parseInt(_0x42c817.replace('p', ''), 0xa);
    const _0x3d966e = {
      'button': 0x1,
      'start': 0x1,
      'end': 0x1,
      'format': _0x4736a2,
      'url': _0x2f6b39
    };
    const _0x4394ec = {
      'Accept': "*/*",
      'Accept-Encoding': "gzip, deflate, br",
      'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'Origin': "https://loader.to",
      'Referer': "https://loader.to",
      'Sec-Ch-Ua': "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
      'Sec-Ch-Ua-Mobile': '?1',
      'Sec-Ch-Ua-Platform': "\"Android\"",
      'Sec-Fetch-Dest': "empty",
      'Sec-Fetch-Mode': "cors",
      'Sec-Fetch-Site': "cross-site",
      'User-Agent': "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
    };
    const _0x22556a = await axios.get("https://ab.cococococ.com/ajax/download.php", {
      'params': _0x3d966e,
      'headers': _0x4394ec
    });
    const _0x2896cf = _0x22556a.data.id;
    const _0x44fc6b = async () => {
      const _0x1d750c = {
        'id': _0x2896cf
      };
      try {
        const _0x5e5c67 = await axios.get("https://p.oceansaver.in/ajax/progress.php", {
          'params': _0x1d750c,
          'headers': _0x4394ec
        });
        const {
          progress: _0x53deb8,
          download_url: _0x145ecd,
          text: _0x4f99c3
        } = _0x5e5c67.data;
        return _0x4f99c3 === 'Finished' ? _0x145ecd : (await new Promise(_0x425fca => setTimeout(_0x425fca, 0x3e8)), _0x44fc6b());
      } catch (_0x5b1f1c) {
        throw new Error("Error in progress check: " + _0x5b1f1c.message);
      }
    };
    return await _0x44fc6b();
  } catch (_0x374084) {
    console.error("Error:", _0x374084);
    return {
      'error': _0x374084.message
    };
  }
}
module.exports = {
  'ytmp4': ytmp4
};
function extractYouTubeId(_0x14c96b) {
  const _0x347f91 = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|playlist\?list=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const _0x5d6e8d = _0x14c96b.match(_0x347f91);
  return _0x5d6e8d ? _0x5d6e8d[0x1] : null;
}
function convertYouTubeLink(_0x48eb5f) {
  const _0x18df7a = extractYouTubeId(_0x48eb5f);
  if (_0x18df7a) {
    return "https://www.youtube.com/watch?v=" + _0x18df7a;
  }
  return _0x48eb5f;
}
cmd({
  'pattern': 'son',
  'alias': "play",
  'desc': "To download songs.",
  'react': '🎵',
  'category': 'download',
  'filename': __filename
}, async (_0xd441b6, _0x3cb21e, _0x58977b, {
  from: _0x1089ae,
  quoted: _0x448006,
  body: _0x295cbb,
  isCmd: _0x53c084,
  command: _0x23fac9,
  args: _0x9bafe3,
  q: _0x44c273,
  isGroup: _0x1465c1,
  sender: _0x19219b,
  senderNumber: _0x2ed57b,
  botNumber2: _0x2b2181,
  botNumber: _0x4ff04d,
  pushname: _0x181cf5,
  isMe: _0x4b2e8c,
  isOwner: _0x13afbe,
  groupMetadata: _0x4a3b13,
  groupName: _0x4dbc72,
  participants: _0x348e11,
  groupAdmins: _0x40d1da,
  isBotAdmins: _0x117d8e,
  isAdmins: _0x5d8ab2,
  reply: _0x1f0567
}) => {
  try {
    if (!_0x44c273) {
      return _0x1f0567("Please give me a URL or title.");
    }
    _0x44c273 = convertYouTubeLink(_0x44c273);
    const _0x5d23a1 = await yts(_0x44c273);
    const _0x592bc6 = _0x5d23a1.videos[0x0];
    const _0x52614c = _0x592bc6.url;
    let _0x34af34 = "\n*silva-MUSIC*\n┏━━━━━━━━━━━━━\n*silva ꜱᴏɴɢ ᴅᴏᴡɴʟᴏᴀᴅ*\n┗━━━━━━━━━━━━━\n┏━━━━━━━━━━━━━━\n*❍ᴛɪᴛʟᴇ :* " + _0x592bc6.title + "\n❍*ᴅᴜʀᴀᴛɪᴏɴ :* " + _0x592bc6.timestamp + "\n*❍ᴠɪᴇᴡꜱ :* " + _0x592bc6.views + "\n❍*ᴜᴘʟᴏᴀᴅ ᴏɴ :* " + _0x592bc6.ago + "\n┗━━━━━━━━━━━━━━━\n\n\n🔢 *ʀᴇᴘʟʏ ʙᴇʟᴏᴡ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴛᴏ*\n*ᴅᴏᴡɴʟᴏᴀᴅ ꜰʀᴏᴍᴀᴛ*\n\n*ᴅᴏᴡɴʟᴏᴀᴅ ᴀᴜᴅɪᴏ 🎧*\n\n*1*     ┃  *ᴀᴜᴅɪᴏ*\n\n*ᴅᴏᴡɴʟᴏᴀᴅ ᴅᴏᴄᴜᴍᴇɴᴛ 📁*\n\n*2*     ┃  *ᴅᴏᴄᴜᴍᴇɴᴛ*\n\n> *©silva ♡*\n";
    const _0x465005 = await _0xd441b6.sendMessage(_0x1089ae, {
      'image': {
        'url': _0x592bc6.thumbnail
      },
      'caption': _0x34af34
    }, {
      'quoted': _0x3cb21e
    });
    const _0x39b395 = _0x465005.key.id;
    _0xd441b6.ev.on('messages.upsert', async _0x5f1d1c => {
      const _0x1d729a = _0x5f1d1c.messages[0x0];
      if (!_0x1d729a.message) {
        return;
      }
      const _0x21b8a6 = _0x1d729a.message.conversation || _0x1d729a.message.extendedTextMessage?.["text"];
      const _0x480efc = _0x1d729a.key.remoteJid;
      const _0x117939 = _0x1d729a.message.extendedTextMessage && _0x1d729a.message.extendedTextMessage.contextInfo.stanzaId === _0x39b395;
      if (_0x117939) {
        await _0xd441b6.sendMessage(_0x480efc, {
          'react': {
            'text': '⬇️',
            'key': _0x1d729a.key
          }
        });
        const _0x410255 = await fetchJson("https://www.dark-yasiya-api.site/download/ytmp3?url=" + _0x52614c);
        const _0x5bcd73 = _0x410255.result.dl_link;
        await _0xd441b6.sendMessage(_0x480efc, {
          'delete': _0x465005.key
        });
        await _0xd441b6.sendMessage(_0x480efc, {
          'react': {
            'text': '⬆️',
            'key': _0x1d729a.key
          }
        });
        if (_0x21b8a6 === '1') {
          await _0xd441b6.sendMessage(_0x480efc, {
            'audio': {
              'url': _0x5bcd73
            },
            'mimetype': "audio/mpeg",
            'contextInfo': {
              'externalAdReply': {
                'title': _0x592bc6.title,
                'body': _0x592bc6.videoId,
                'mediaType': 0x1,
                'sourceUrl': _0x592bc6.url,
                'thumbnailUrl': _0x592bc6.thumbnail,
                'renderLargerThumbnail': true,
                'showAdAttribution': true
              }
            }
          }, {
            'quoted': _0x1d729a
          });
          await _0xd441b6.sendMessage(_0x480efc, {
            'react': {
              'text': '✅',
              'key': _0x1d729a.key
            }
          });
        } else if (_0x21b8a6 === '2') {
          await _0xd441b6.sendMessage(_0x480efc, {
            'document': {
              'url': _0x5bcd73
            },
            'mimetype': 'audio/mp3',
            'fileName': _0x592bc6.title + ".mp3",
            'caption': "\n*©ᴘᴏᴡᴇʀᴇᴅ ʙʏ Jᴀᴡᴀᴅ TᴇᴄʜX*\n "
          }, {
            'quoted': _0x1d729a
          });
          await _0xd441b6.sendMessage(_0x480efc, {
            'react': {
              'text': '✅',
              'key': _0x1d729a.key
            }
          });
        }
      }
    });
  } catch (_0x2f7fdf) {
    console.log(_0x2f7fdf);
    _0x1f0567('' + _0x2f7fdf);
  }
});
cmd({
  'pattern': "video",
  'desc': "To download videos.",
  'react': '🎥',
  'category': "download",
  'filename': __filename
}, async (_0x12976e, _0x2a3b25, _0x5c4c02, {
  from: _0x27b1b7,
  quoted: _0x21397c,
  body: _0x5e42b7,
  isCmd: _0xce8649,
  command: _0x338d66,
  args: _0x2d3e67,
  q: _0x5aa0b2,
  isGroup: _0x3c88ab,
  sender: _0x5932f6,
  senderNumber: _0x4eac87,
  botNumber2: _0x58efd9,
  botNumber: _0x54ed3d,
  pushname: _0x21c577,
  isMe: _0x72c003,
  isOwner: _0x20026d,
  groupMetadata: _0x52226e,
  groupName: _0x2b5bf8,
  participants: _0xb68b13,
  groupAdmins: _0x305183,
  isBotAdmins: _0x1e8337,
  isAdmins: _0x54abb9,
  reply: _0x26c04d
}) => {
  try {
    if (!_0x5aa0b2) {
      return _0x26c04d("Please give me a URL or title.");
    }
    _0x5aa0b2 = convertYouTubeLink(_0x5aa0b2);
    const _0x3c79a1 = await yts(_0x5aa0b2);
    const _0x30702a = _0x3c79a1.videos[0x0];
    const _0x3af288 = _0x30702a.url;
    let _0x5ed924 = "\n*spark-VIDEO*\n\n┏━━━━━━━━━━━━━\n┃*Silva ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅ ✻*\n┗━━━━━━━━━━━━━\n┏━━━━━━━━━━━━━━\n❍*ᴛɪᴛʟᴇ :* " + _0x30702a.title + "\n*❍ᴅᴜʀᴀᴛɪᴏɴ :* " + _0x30702a.timestamp + "\n❍*ᴠɪᴇᴡꜱ :* " + _0x30702a.views + "\n❍*ᴜᴘʟᴏᴀᴅ ᴏɴ :* " + _0x30702a.ago + "\n━━━━━━━━━━━━━━━\n\n\n🔢 *ʀᴇᴘʟʏ ʙᴇʟᴏᴡ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴛᴏ*\n*ᴅᴏᴡɴʟᴏᴀᴅ ꜰʀᴏᴍᴀᴛ*\n\n*ᴅᴏᴡɴʟᴏᴀᴅ ᴠɪᴅᴇᴏ 🎬*\n\n*1.1*     ┃  *360ᴘ*\n*1.2*     ┃  *480ᴘ*\n*1.3*     ┃  *720ᴘ*\n*1.4*     ┃  *1080ᴘ*\n\n*ᴅᴏᴡɴʟᴏᴀᴅ ᴅᴏᴄᴜᴍᴇɴᴛ 📁*\n\n*2.1*     ┃  *360ᴘ*\n*2.2*     ┃  *480ᴘ*\n*2.3*     ┃  *720ᴘ*\n*2.4*     ┃  *1080ᴘ*\n\n> *©silva spark ♡*\n";
    const _0x1d50f1 = await _0x12976e.sendMessage(_0x27b1b7, {
      'image': {
        'url': _0x30702a.thumbnail
      },
      'caption': _0x5ed924
    }, {
      'quoted': _0x2a3b25
    });
    ;
    const _0x1f40a6 = _0x1d50f1.key.id;
    _0x12976e.ev.on('messages.upsert', async _0x293b2b => {
      const _0x1411c6 = _0x293b2b.messages[0x0];
      if (!_0x1411c6.message) {
        return;
      }
      const _0x1a87a3 = _0x1411c6.message.conversation || _0x1411c6.message.extendedTextMessage?.["text"];
      const _0x607759 = _0x1411c6.key.remoteJid;
      const _0x1639d9 = _0x1411c6.message.extendedTextMessage && _0x1411c6.message.extendedTextMessage.contextInfo.stanzaId === _0x1f40a6;
      if (_0x1639d9) {
        await _0x12976e.sendMessage(_0x607759, {
          'react': {
            'text': '⬇️',
            'key': _0x1411c6.key
          }
        });
        if (_0x1a87a3 === "1.1") {
          const _0x3b3014 = await ytmp4('' + _0x3af288, "360p");
          await _0x12976e.sendMessage(_0x607759, {
            'delete': _0x1d50f1.key
          });
          await _0x12976e.sendMessage(_0x607759, {
            'react': {
              'text': '⬆️',
              'key': _0x1411c6.key
            }
          });
          await _0x12976e.sendMessage(_0x607759, {
            'video': {
              'url': _0x3b3014
            },
            'caption': "\n*©SILVA SPARK*\n"
          }, {
            'quoted': _0x1411c6
          });
          await _0x12976e.sendMessage(_0x607759, {
            'react': {
              'text': '✅',
              'key': _0x1411c6.key
            }
          });
        } else {
          if (_0x1a87a3 === "1.2") {
            const _0x2f1c03 = await ytmp4('' + _0x3af288, "480");
            await _0x12976e.sendMessage(_0x607759, {
              'delete': _0x1d50f1.key
            });
            await _0x12976e.sendMessage(_0x607759, {
              'react': {
                'text': '⬆️',
                'key': _0x1411c6.key
              }
            });
            await _0x12976e.sendMessage(_0x607759, {
              'video': {
                'url': _0x2f1c03
              },
              'caption': "\n*©SILVA SPARK*\n"
            }, {
              'quoted': _0x1411c6
            });
            await _0x12976e.sendMessage(_0x607759, {
              'react': {
                'text': '✅',
                'key': _0x1411c6.key
              }
            });
          } else {
            if (_0x1a87a3 === "1.3") {
              const _0x28e0f3 = await ytmp4('' + _0x3af288, '720');
              await _0x12976e.sendMessage(_0x607759, {
                'delete': _0x1d50f1.key
              });
              await _0x12976e.sendMessage(_0x607759, {
                'react': {
                  'text': '⬆️',
                  'key': _0x1411c6.key
                }
              });
              await _0x12976e.sendMessage(_0x607759, {
                'video': {
                  'url': _0x28e0f3
                },
                'caption': "\n*©SILVA SPARK*\n"
              }, {
                'quoted': _0x1411c6
              });
              await _0x12976e.sendMessage(_0x607759, {
                'react': {
                  'text': '✅',
                  'key': _0x1411c6.key
                }
              });
            } else {
              if (_0x1a87a3 === '1.4') {
                const _0x153d70 = await ytmp4('' + _0x3af288, "1080");
                await _0x12976e.sendMessage(_0x607759, {
                  'delete': _0x1d50f1.key
                });
                await _0x12976e.sendMessage(_0x607759, {
                  'react': {
                    'text': '⬆️',
                    'key': _0x1411c6.key
                  }
                });
                await _0x12976e.sendMessage(_0x607759, {
                  'video': {
                    'url': _0x153d70
                  },
                  'caption': "\n*©SILVA SPARK*\n"
                }, {
                  'quoted': _0x1411c6
                });
                await _0x12976e.sendMessage(_0x607759, {
                  'react': {
                    'text': '✅',
                    'key': _0x1411c6.key
                  }
                });
              } else {
                if (_0x1a87a3 === '2.1') {
                  const _0x416b0c = await ytmp4('' + _0x3af288, '360');
                  await _0x12976e.sendMessage(_0x607759, {
                    'delete': _0x1d50f1.key
                  });
                  await _0x12976e.sendMessage(_0x607759, {
                    'react': {
                      'text': '⬆️',
                      'key': _0x1411c6.key
                    }
                  });
                  await _0x12976e.sendMessage(_0x607759, {
                    'document': {
                      'url': _0x416b0c
                    },
                    'mimetype': "video/mp4",
                    'fileName': _0x30702a.title + ".mp4",
                    'caption': "\n*©SILVA SPARK*\n"
                  }, {
                    'quoted': _0x1411c6
                  });
                  await _0x12976e.sendMessage(_0x607759, {
                    'react': {
                      'text': '✅',
                      'key': _0x1411c6.key
                    }
                  });
                } else {
                  if (_0x1a87a3 === "2.2") {
                    const _0x31f905 = await ytmp4('' + _0x3af288, "480");
                    await _0x12976e.sendMessage(_0x607759, {
                      'delete': _0x1d50f1.key
                    });
                    await _0x12976e.sendMessage(_0x607759, {
                      'react': {
                        'text': '⬆️',
                        'key': _0x1411c6.key
                      }
                    });
                    await _0x12976e.sendMessage(_0x607759, {
                      'document': {
                        'url': _0x31f905
                      },
                      'mimetype': "video/mp4",
                      'fileName': _0x30702a.title + '.mp4',
                      'caption': "\n*©SILVA SPARK*\n"
                    }, {
                      'quoted': _0x1411c6
                    });
                    await _0x12976e.sendMessage(_0x607759, {
                      'react': {
                        'text': '✅',
                        'key': _0x1411c6.key
                      }
                    });
                  } else {
                    if (_0x1a87a3 === '2.3') {
                      const _0x213ca9 = await ytmp4('' + _0x3af288, "720");
                      await _0x12976e.sendMessage(_0x607759, {
                        'delete': _0x1d50f1.key
                      });
                      await _0x12976e.sendMessage(_0x607759, {
                        'react': {
                          'text': '⬆️',
                          'key': _0x1411c6.key
                        }
                      });
                      await _0x12976e.sendMessage(_0x607759, {
                        'document': {
                          'url': _0x213ca9
                        },
                        'mimetype': "video/mp4",
                        'fileName': _0x30702a.title + '.mp4',
                        'caption': "\n*©SILVA SPARK*\n"
                      }, {
                        'quoted': _0x1411c6
                      });
                      await _0x12976e.sendMessage(_0x607759, {
                        'react': {
                          'text': '✅',
                          'key': _0x1411c6.key
                        }
                      });
                    } else {
                      if (_0x1a87a3 === "2.4") {
                        const _0x4d2276 = await ytmp4('' + _0x3af288, "1080");
                        await _0x12976e.sendMessage(_0x607759, {
                          'delete': _0x1d50f1.key
                        });
                        await _0x12976e.sendMessage(_0x607759, {
                          'react': {
                            'text': '⬆️',
                            'key': _0x1411c6.key
                          }
                        });
                        await _0x12976e.sendMessage(_0x607759, {
                          'document': {
                            'url': _0x4d2276
                          },
                          'mimetype': "video/mp4",
                          'fileName': _0x30702a.title + ".mp4",
                          'caption': "\n*©SILVA SPARK*\n"
                        }, {
                          'quoted': _0x1411c6
                        });
                        await _0x12976e.sendMessage(_0x607759, {
                          'react': {
                            'text': '✅',
                            'key': _0x1411c6.key
                          }
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  } catch (_0x50fc65) {
    console.log(_0x50fc65);
    _0x26c04d('' + _0x50fc65);
  }
});
cmd({
  'pattern': "yta",
  'alias': "ytmp3",
  'react': '⬇️',
  'dontAddCommandList': true,
  'filename': __filename
}, async (_0x260936, _0x133e2e, _0x4417dd, {
  from: _0x4be619,
  q: _0x38df3a,
  reply: _0x25afc5
}) => {
  try {
    if (!_0x38df3a) {
      return await _0x25afc5("*Need a YouTube URL!*");
    }
    const _0xc7919b = await fetchJson("https://www.dark-yasiya-api.site/download/ytmp3?url=" + _0x38df3a);
    const _0x50409b = _0xc7919b.result.dl_link;
    await _0x260936.sendMessage(_0x4be619, {
      'audio': {
        'url': _0x50409b
      },
      'mimetype': "audio/mpeg"
    }, {
      'quoted': _0x133e2e
    });
  } catch (_0x42ce9e) {
    console.log("First attempt failed:", _0x42ce9e);
    try {
      const _0x10e500 = await dlyta(_0x38df3a);
      await _0x260936.sendMessage(_0x4be619, {
        'audio': {
          'url': _0x10e500.dl_link
        },
        'mimetype': 'audio/mpeg'
      }, {
        'quoted': _0x133e2e
      });
    } catch (_0x154bfe) {
      console.log("Second attempt failed:", _0x154bfe);
      await _0x25afc5("*Failed to process the request. Please try again later!*");
    }
  }
});
