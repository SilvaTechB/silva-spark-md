var commands = [];

function cmd(info, func) {
    try {
        var data = info;
        data.function = func;
        
        // Set default values
        data.dontAddCommandList = data.dontAddCommandList || false;
        data.desc = info.desc || '';
        data.fromMe = data.fromMe || false;
        data.category = info.category || 'misc';
        data.filename = info.filename || "Not Provided";
        data.use = info.use || '';
        
        // Validate required fields
        if (!data.pattern && !data.on) {
            console.error('⚠️ Command registered without pattern or event:', data.filename);
            return data;
        }
        
        commands.push(data);
        return data;
    } catch (e) {
        console.error('Error registering command:', e.message);
        return null;
    }
}

// Function to get all commands
function getCommands() {
    return commands;
}

// Function to find command by pattern
function findCommand(pattern) {
    return commands.find(cmd => 
        cmd.pattern === pattern || 
        (cmd.alias && cmd.alias.includes(pattern))
    );
}

// Function to get commands by category
function getCommandsByCategory(category) {
    return commands.filter(cmd => cmd.category === category);
}

// Function to clear all commands (useful for reloading)
function clearCommands() {
    commands = [];
}

module.exports = {
    cmd,
    AddCommand: cmd,
    Function: cmd,
    Module: cmd,
    commands,
    getCommands,
    findCommand,
    getCommandsByCategory,
    clearCommands
};
