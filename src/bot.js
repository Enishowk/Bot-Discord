const Discord = require("discord.js");
const fs = require("fs");
const CronJob = require("cron").CronJob;
const axios = require("axios");

const config = require("../config/config.json");

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
  bot.login(config.token).catch(err => console.error(err));
});

// Event listener for messages
bot.on("message", async message => {
  if (!message.content.startsWith(config.startCommand)) return;
  const args = message.content.slice(config.startCommand.length).split(/ +/);
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

const checkApi = async () => {
  const { data } = await axios.get(
    "https://api-prod.nvidia.com/direct-sales-shop/DR/products/fr_fr/EUR/5438795200"
  );
  data.products.product.forEach((element) => {
    if (element.inventoryStatus.productIsInStock === "true") {
      bot.users.fetch(config.userAdmin).then(user => user.send("EN STOCK !!"))
    }
  });
};
const job = new CronJob("*/30 * * * * *", async function () {
  checkApi();
});
job.start();

bot.login(config.token);
