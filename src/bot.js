const Discord = require("discord.js");
const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");
const fs = require("fs");
const moment = require("moment");

const config = require("../config/config.json");

const bot = new Discord.Client();
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

// Create an event listener for messages
bot.on("message", message => {
  const args = message.content.slice(config.startCommand.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!bot.commands.has(commandName)) return;

  const command = bot.commands.get(commandName);
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

// Cron : Execute bm() at 10:20 Monday-Friday
cron.schedule("20 10 * * 1-5", () => {
  axios.get("http://dites.bonjourmadame.fr/").then(response => {
    const $ = cheerio.load(response.data);
    const urlPhoto = $(".photo.post")
      .find("img")
      .attr("src");
    bot.channels.get(config.nsfwChan).send(urlPhoto);
  });
});

// Cron : don't forget to do Logtime
cron.schedule("50 17 * * 1-5", () => {
  const today = moment().format("YYYY-MM-DD");
  axios
    .get(`http://redmine.smartpanda.fr/time_entries.json?spent_on=><${today}|${today}&user_id=${config.redmineId}`, {
      headers: { "X-Redmine-API-Key": config.redmineToken },
    })
    .then(response => {
      if (response.data.total_count === 0) {
        bot.fetchUser(config.userAdmin).then(r => r.send("Logtime !"));
      }
    });
});

// log bot
bot.login(config.token);
