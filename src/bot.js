require('dotenv').config()
const Discord = require("discord.js");
const fs = require("fs");
const CronJob = require("cron").CronJob;
const axios = require("axios");
const moment = require("moment")

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

let lastMessage = undefined
const checkApi = async () => {
  try {
    const { data } = await axios.get(
      "https://api-prod.nvidia.com/direct-sales-shop/DR/products/fr_fr/EUR/5438795200"
    );
    data.products.product.forEach((element) => {
      if (element.inventoryStatus.productIsInStock === "true" && element.inventoryStatus.status !== "PRODUCT_INVENTORY_OUT_OF_STOCK") {
        console.log(lastMessage && lastMessage.format("hh:mm:ss"))
        if (lastMessage === undefined || moment().isAfter(lastMessage.clone().add(10, 'm'))) {
          lastMessage = moment();
          bot.users.fetch(process.env.USER_ADMIN).then(user => user.send("https://www.nvidia.com/fr-fr/geforce/graphics-cards/30-series/rtx-3080/ !!"))
        }
      }
    });
  } catch (error) {
    console.error("ERROR CRON:", error.message)
  }
};
const job = new CronJob("0 * * * * *", async function () {
  checkApi();
});
job.start();

bot.login(process.env.TOKEN);
