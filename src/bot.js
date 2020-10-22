require('dotenv').config()
const Discord = require("discord.js");
const fs = require("fs");

const bot = new Discord.Client({ autoReconnect: true });
bot.commands = new Discord.Collection();

// Init all command
const commandFiles = fs.readdirSync("./src/commands/");
commandFiles.forEach(file => {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
});

bot.on("ready", () => {
  bot.user.setActivity(".help", { type: "LISTENING" }).catch(err => console.error(err));
  console.log("Bot ready");
});
bot.on("disconnected", () => {
  bot.login(process.env.TOKEN).catch(err => console.error(err));
});

// Event listener for messages
bot.on("message", async message => {
  if (!message.content.startsWith(process.env.START_COMMAND)) return;
  const args = message.content.slice(process.env.START_COMMAND.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!bot.commands.has(commandName)) return;

  const command = bot.commands.get(commandName);
  try {
    await command.execute(message, args, bot);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

bot.login(process.env.TOKEN);
