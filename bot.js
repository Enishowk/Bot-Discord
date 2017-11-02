const cheerio = require("cheerio");
const cron = require("node-cron");
const Discord = require("discord.js");
const fs = require("fs");
const randomPuppy = require("random-puppy");
const request = require("request");
const ytdl = require("ytdl-core");

const config = require("./config.json");
const bot = new Discord.Client();

bot.on("ready", () => {
    bot.user.setGame(".help").catch((err) => console.log(err));
    console.log("Bot ready");
});
bot.on("disconnected", function () {
    bot.login(config.token).catch((err) => console.log(err));
});


// Create an event listener for messages
bot.on("message", (message) => {
    let messageOrigin, command, firstParam;

    // Listen message and parse command and param
    if (message.content.startsWith(config.startCommand)) {
        messageOrigin = message.content.toLowerCase().split(" ");
        command = messageOrigin[0].substring(1);
        firstParam = messageOrigin[1];
    }

    // Get one random image from a subreddit
    if (command === "sb") {
        let subreddit = firstParam !== undefined ? firstParam : "aww";
        randomPuppy(subreddit).then((url) => {
            message.channel.send(url);
            if (message.channel.nsfw) {
                message.delete();
            }
        });
    }

    // Play sound from sound folder
    if (command === "play") {
        let voiceChannel = message.member.voiceChannel;
        if (voiceChannel !== undefined) {
            // Check if the sound exist
            let soundExist = false;
            let contentFolder = fs.readdirSync("sound/");
            contentFolder.forEach((file) => {
                let soundName = file.substring(0, file.length - 4);
                if (firstParam === soundName) {
                    soundExist = true;
                }
            });
            if (soundExist) {
                voiceChannel.join()
                    .then((connection) => {
                        let dispatcher = connection.playFile("sound/" + firstParam + ".mp3");
                        dispatcher.on("end", () => {
                            voiceChannel.leave();
                        });
                    });
            } else {
                message.channel.send("Le son " + firstParam + " n'existe pas.");
            }
        } else {
            message.channel.send("Tu n'es pas dans un chan vocal.");
        }
    }

    // Play song from Youtube in voice channel
    if (command === "yt") {
        let voiceChannel = message.member.voiceChannel;
        if (voiceChannel !== undefined) {
            // Play streams using ytdl-core
            const streamOptions = {seek: 0, volume: 0.5};
            voiceChannel.join()
                .then(connection => {
                    let streamURL = message.content.split(" ")[1];
                    const stream = ytdl(streamURL, {filter: "audioonly"});
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
        let voiceChannel = message.member.voiceChannel;
        voiceChannel.leave();
    }

    // Repeat message with the bot.
    if (command === "say") {
        let messageRepeat = message.content.substring(5, message.content.length);
        message.channel.send(messageRepeat);
        message.delete();
    }

    // Generate random number
    if (command === "rand") {
        let rand = Math.floor((Math.random() * parseInt(firstParam)) + 1);
        message.channel.send(rand);
    }

    // Send french wiki command with param
    if (command === "wiki") {
        let param = message.content.substring(6, message.content.length);
        let search = param.replace(/ /g, "_");
        let url = "https://fr.wikipedia.org/wiki/" + search;
        message.channel.send(url);
    }

    // Command for BM request
    if (command === "bm" && message.channel.nsfw) {
        message.delete();
        bm();
    }

    // Command joke
    if (command === "gouter") {
        let date = new Date();
        let hour = date.getHours();
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
        let calcul = (parseInt(firstParam) / 20);
        message.channel.send("Cela fait ENVIRON " + (calcul * 60).toFixed() + " Rostis et " + (calcul * 10).toFixed() + " steaks.");
    }

    // PM command
    if (command === "help") {
        if (firstParam === "sound") {
            let contentFolder = fs.readdirSync("sound/");
            let arrayOfSound = [];
            contentFolder.forEach((file) => {
                let soundName = file.substring(0, file.length - 4);
                arrayOfSound.push(soundName);
            });
            message.author.send("List : " + arrayOfSound);
        } else {
            message.author.send(help());
        }
    }

});

// Function Help (Not Update)
function help() {
    return [".sb 'subreddit'",
        ".play 'sound'",
        ".yt 'link'",
        ".stop",
        ".say 'message'",
        ".rand 'number'",
        ".wiki 'name'",
        ".bm",
        ".gouter",
        ".rosti 'number'",
        ".help sound"];
}

// Get image of the day from Bonjour Madame
function bm() {
    request("http://dites.bonjourmadame.fr/", function (error, response, html) {
        if (!error && response.statusCode === 200) {
            let $ = cheerio.load(html);
            let urlPhoto = $(".photo.post").find("img").attr("src");
            // Send URL in my NSFW channel. 
            bot.channels.get(config.nsfwChan).send(urlPhoto);
        }
    });
}

// Cron : Execute bm() at 10:20 Monday-Friday
cron.schedule("20 10 * * 1-5", function () {
    bm();
});

// log bot
bot.login(config.token);