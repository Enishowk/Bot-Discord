const fs = require("fs");

module.exports = {
  name: "help",
  description: "Help command",
  execute(message, args) {
    const help = [];
    const { commands } = message.client;

    if (args[0] && args[0] === "sound") {
      const contentFolder = fs.readdirSync("./src/sound");
      contentFolder.forEach(file => {
        const soundName = file.substring(0, file.length - 4);
        help.push(soundName);
      });
    } else {
      help.push(commands.map(command => `**.${command.name}** : ${command.description}`).join("\n"));
    }
    message.author.send(help);
  },
};
