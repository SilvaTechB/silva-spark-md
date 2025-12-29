const axios = require('axios');
const { cmd, commands } = require("../command");

cmd({
  pattern: "srepo",
  desc: "Fetch information about a GitHub repository.",
  category: "other",
  react: "🍃",
  filename: __filename
}, async (conn, mek, m, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    const repoName = args.join(" "); // Combine arguments to form "owner/repo"
    if (!repoName) {
      return reply("Please provide a GitHub repository name in the format 📌`owner/repo`.");
    }

    // Construct GitHub API URL for the repository
    const apiUrl = `https://api.github.com/repos/${repoName}`;
    const response = await axios.get(apiUrl); // Fetch repository data from GitHub
    const repoData = response.data;

    // Prepare repository information message
    let repoInfo = "📁_*GITHUB REPO INFO BY SILVA SPARK*_📁\n\n";
    repoInfo += `📌 *Name*: ${repoData.name}\n`;
    repoInfo += `🔗 *URL*: ${repoData.html_url}\n`;
    repoInfo += `📝 *Description*: ${repoData.description || "No description provided"}\n`;
    repoInfo += `⭐ *Stars*: ${repoData.stargazers_count}\n`;
    repoInfo += `🍴 *Forks*: ${repoData.forks_count}\n\n`;
    repoInfo += "> *© Powered By SILVA SPARK*\n";

    // Send repository info as a message
    await conn.sendMessage(from, { text: repoInfo }, { quoted });

  } catch (error) {
    console.error("Error fetching repository data:", error);
    reply(`Error fetching repository data 🤕: ${error.message}`);
  }
});
