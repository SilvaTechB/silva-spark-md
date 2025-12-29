const fs = require('fs');
const { exec } = require('child_process');
const { cmd } = require('../command');

cmd({
    pattern: "update",
    react: "🦄",
    desc: "Update the repository from GitHub",
    category: "system",
    use: ".update",
    filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
    try {
        const repoUrl = 'https://github.com/SilvaTechB/silva-spark-md.git'; // GitHub repository URL
        const targetFolder = 'plugins'; // Local folder for the repo

        // Ensure the target folder exists
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder); // Create folder if it doesn't exist
        }

        // Determine the appropriate Git command
        const gitCommand = fs.existsSync(`${targetFolder}/.git`)
            ? `git -C ${targetFolder} pull` // Pull latest changes if already cloned
            : `git clone ${repoUrl} ${targetFolder}`; // Clone repo if not already done

        // Execute the Git command
        const output = await new Promise((resolve, reject) => {
            exec(gitCommand, (err, stdout, stderr) => {
                if (err) {
                    reject(new Error(`Git command failed: ${stderr.trim()}`));
                } else {
                    resolve(stdout.trim());
                }
            });
        });

        // Send a success message with the output
        await conn.sendMessage(
            from,
            { text: `*✅ Silva Spark Update completed successfully!*\n\n\`\`\`${output}\`\`\`` },
            { quoted: mek }
        );
    } catch (error) {
        console.error(error);
        reply(`*❌ Error during update:* ${error.message}`);
    }
});
