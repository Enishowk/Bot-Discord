const cron = require("node-cron");
const Discord = require("discord.js");
const fs = require("fs");
const randomPuppy = require("random-puppy");
const ytdl = require("ytdl-core");

const config = require("../config/config.json");
const tools = require("./functions");

const bot = new Discord.Client();

bot.on("ready", () => {
  bot.user.setGame(".help").catch(err => console.error(err));
  console.log("Bot ready"); // eslint-disable-line no-console
});
bot.on("disconnected", () => {
  bot.login(config.token).catch(err => console.error(err));
});

// Create an event listener for messages
bot.on("message", message => {
  let messageOrigin;
  let command;
  let firstParam;

  // Listen message and parse command and param
  if (message.content.startsWith(config.startCommand)) {
    messageOrigin = message.content.toLowerCase().split(" ");
    command = messageOrigin[0].substring(1);
    firstParam = messageOrigin[1];
  }

  // Get one random image from a subreddit
  if (command === "sb") {
    const subreddit = firstParam !== undefined ? firstParam : "aww";
    randomPuppy(subreddit).then(url => {
      message.channel.send(url);
      if (message.channel.nsfw) {
        message.delete();
      }
    });
  }

  // Play sound from sound folder
  if (command === "play") {
    const { voiceChannel } = message.member;
    if (voiceChannel !== undefined) {
      // Check if the sound exist
      let soundExist = false;
      const contentFolder = fs.readdirSync("./src/sound");
      contentFolder.forEach(file => {
        const soundName = file.substring(0, file.length - 4);
        if (firstParam === soundName) {
          soundExist = true;
        }
      });
      if (soundExist) {
        voiceChannel.join().then(connection => {
          const dispatcher = connection.playFile(`./src/sound/${firstParam}.mp3`);
          dispatcher.on("end", () => {
            voiceChannel.leave();
          });
        });
      } else {
        message.channel.send(`Le son ${firstParam} n'existe pas.`);
      }
    } else {
      message.channel.send("Tu n'es pas dans un chan vocal.");
    }
  }

  // Play song from Youtube in voice channel
  if (command === "yt") {
    const { voiceChannel } = message.member;
    if (voiceChannel !== undefined) {
      // Play streams using ytdl-core
      const streamOptions = { seek: 0, volume: 0.5 };
      voiceChannel
        .join()
        .then(connection => {
          const streamURL = message.content.split(" ")[1];
          const stream = ytdl(streamURL, { filter: "audioonly" });
          const dispatcher = connection.playStream(stream, streamOptions);
          dispatcher.on("end", () => {
            voiceChannel.leave();
          });
        })
        .catch(console.error);
    } else {
      message.channel.send("Tu n'es pas dans un chan vocal.");
    }
  }

  // Kick bot from voice channel
  if (command === "stop") {
    const { voiceChannel } = message.member;
    voiceChannel.leave();
  }

  // Repeat message with the bot.
  if (command === "say") {
    const messageRepeat = message.content.substring(5, message.content.length);
    message.channel.send(messageRepeat);
    message.delete();
  }

  // Generate random number
  if (command === "rand") {
    const rand = Math.floor(Math.random() * parseInt(firstParam, 10) + 1);
    message.channel.send(rand);
  }

  // Send french wiki command with param
  if (command === "wiki") {
    const param = message.content.substring(6, message.content.length);
    const search = param.replace(/ /g, "_");
    const url = `https://fr.wikipedia.org/wiki/${search}`;
    message.channel.send(url);
  }

  // Command for BM request
  if (command === "bm" && message.channel.nsfw) {
    message.delete();
    tools.bm().then(urlPhoto => {
      bot.channels.get(config.nsfwChan).send(urlPhoto);
    });
  }

  // Command for Bitcoin value
  if (command === "bitcoin") {
    tools.bitcoin().then(value => {
      message.channel.send(`La valeur du bitcoin est de : ${value[0]}, soit ${value[1]}`);
    });
  }

  // Command joke
  if (command === "gouter") {
    const date = new Date();
    const hour = date.getHours();
    let response = "";

    if (hour >= 16 && hour < 17) {
      response = "C'est l'heure du goûter ! :peach:";
    } else if (hour >= 15 && hour < 16) {
      response = "C'est bientôt l'heure du goûter ( ͡° ͜ʖ ͡°)";
    } else {
      response = "C'est pas l'heure du goûter. :cry:";
    }

    message.channel.send(response);
  }

  // Second joke command
  if (command === "rosti") {
    const calcul = parseInt(firstParam, 10) / 20;
    message.channel.send(`Cela fait ENVIRON ${(calcul * 60).toFixed()} Rostis et ${(calcul * 10).toFixed()} steaks.`);
  }

  // PM command
  if (command === "help") {
    if (firstParam === "sound") {
      const contentFolder = fs.readdirSync("./src/sound");
      const arrayOfSound = [];
      contentFolder.forEach(file => {
        const soundName = file.substring(0, file.length - 4);
        arrayOfSound.push(soundName);
      });
      message.author.send(`List : ${arrayOfSound}`);
    } else {
      message.author.send(tools.help());
    }
  }
});

// Cron : Execute bm() at 10:20 Monday-Friday
cron.schedule("20 10 * * 1-5", () => {
  tools.bm().then(urlPhoto => {
    bot.channels.get(config.nsfwChan).send(urlPhoto);
  });
});

// log bot
bot.login(config.token);
