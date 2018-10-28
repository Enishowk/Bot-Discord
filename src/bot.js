const Discord = require("discord.js");
const cron = require("node-cron");
const fs = require("fs");

const config = require("../config/config.json");

const bot = new Discord.Client({ autoReconnect: true });
bot.commands = new Discord.Collection();

// Init all command
const commandFiles = fs.readdirSync("./src/commands/");
commandFiles.forEach(file => {
  const command = require(`./commands/${file}`); // eslint-disable-line
  bot.commands.set(command.name, command);
});

bot.on("ready", () => {
  bot.user.setActivity(".help", { type: "LISTENING" }).catch(err => console.error(err));
  console.log("Bot ready"); // eslint-disable-line
});
bot.on("disconnected", () => {
  bot.login(config.token).catch(err => console.error(err));
});

// Event listener for messages
bot.on("message", message => {
  if (!message.content.startsWith(config.startCommand)) return;
  const args = message.content.slice(config.startCommand.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!bot.commands.has(commandName)) return;

  const command = bot.commands.get(commandName);
  try {
    command.execute(message, args, bot);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

// Cron : post BM's picture at 10:20 Monday-Friday
cron.schedule("20 10 * * 1-5", () => {
  bot.commands
    .get("bm")
    .getURLFromBM()
    .then(url => {
      bot.channels.get(config.nsfwChan).send(url);
    });
});

bot.login(config.token);
