const axios = require("axios");
const FormData = require("form-data");
const fs = require('fs');
const os = require('os');
const path = require('path');
const { cmd } = require("../command");

cmd({
  'pattern': "tourl",
  'alias': ["imgtourlbb", "imgbburl", "urlbb"],
  'react': '👻',
  'desc': "Convert an image to a URL using imgbb.",
  'category': "utility",
  'use': ".tourl",
  'filename': __filename
}, async (_0x2a615f, _0x296ebb, _0x131287, _0x46c0dd) => {
  const { from: _0x462e92, quoted: _0x38fbf1, reply: _0x74c833, sender: _0x5931e7 } = _0x46c0dd;
  try {
    const _0x2fc0f4 = _0x296ebb.quoted ? _0x296ebb.quoted : _0x296ebb;
    const _0x4dd0ec = (_0x2fc0f4.msg || _0x2fc0f4).mimetype || '';

    // Debugging image mime type
    console.log("Image mime type: ", _0x4dd0ec);

    if (!_0x4dd0ec || !_0x4dd0ec.startsWith("image")) {
      throw "🌻 Please reply to an image.";
    }

    // Download the image
    const _0x227cf8 = await _0x2fc0f4.download();
    const _0x18c2b8 = path.join(os.tmpdir(), "temp_image");
    fs.writeFileSync(_0x18c2b8, _0x227cf8);

    // Debugging: Check file size and existence
    console.log("Temporary file saved at:", _0x18c2b8);
    console.log("Image size: ", _0x227cf8.length, "bytes");

    // Prepare image for upload
    const _0x1bf672 = new FormData();
    _0x1bf672.append("image", fs.createReadStream(_0x18c2b8));

    // Send image to imgbb
    const _0x338f64 = await axios.post("https://api.imgbb.com/1/upload?key=b9dc9d120cc17e0d9bef7071126818e9", _0x1bf672, {
      'headers': {
        ..._0x1bf672.getHeaders()
      }
    });

    // Debugging API response
    console.log("API Response:", _0x338f64.data);

    if (!_0x338f64.data || !_0x338f64.data.data || !_0x338f64.data.data.url) {
      throw "❌ Failed to upload the file.";
    }

    const _0x2b12b1 = _0x338f64.data.data.url;

    // Clean up the temporary file
    fs.unlinkSync(_0x18c2b8);

    const _0x273817 = {
      'mentionedJid': [_0x5931e7],
      'forwardingScore': 0x3e7,
      'isForwarded': true,
      'forwardedNewsletterMessageInfo': {
        'newsletterJid': '120363200367779016@newsletter',
        'newsletterName': "SILVA SPARK 🥰",
        'serverMessageId': 0x8f
      }
    };

    // Send the URL as a reply
    await _0x2a615f.sendMessage(_0x462e92, {
      'text': `*Image Uploaded Successfully 📸*\nSize: ${_0x227cf8.length} Byte(s)\n*URL:* ${_0x2b12b1}\n\n> ⚖️ Uploaded via SILVA-SPARK`,
      'contextInfo': _0x273817
    });

  } catch (_0x5db687) {
    // Handle errors and log them
    _0x74c833("Error: " + _0x5db687);
    console.error("Error occurred:", _0x5db687);
  }
});