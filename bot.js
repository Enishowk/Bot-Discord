const Discord = require("discord.js");
const randomPuppy = require("random-puppy");
const fs = require("fs");
const cron = require("node-cron");
const request = require("request");
const cheerio = require("cheerio"); //Parse html 
const moment = require("moment");
const readLastLines = require("read-last-lines");
const ytdl = require('ytdl-core');
const config = require("./config.json");
const bot = new Discord.Client();

// Get list of sound in sound folder
var arrayOfSound = [];
var contentFolder = fs.readdirSync("sound/");
contentFolder.forEach(function (file) {
    // File without extension
    var fileFormat = file.substring(0, file.length - 4);
    arrayOfSound.push(fileFormat);
});

bot.on("ready", () => {
    bot.user.setGame(".help");
    log("Bot ready");
});
bot.on("disconnected", function () {
    bot.login(config.token);
    log("Bot disconnected");
});


// Create an event listener for messages
bot.on("message", message => {
    // Listen message and parse command and param
    if (message.content.startsWith(".")) {
        var messageOrigin = message.content.toLowerCase().split(" ");
        var command = messageOrigin[0].substring(1);
        var firstParam = messageOrigin[1];
    }

    // Get one random image from a subreddit
    if (command === "sb") {
        let subreddit = firstParam != undefined ? firstParam : "aww";
        randomPuppy(subreddit).then(url => { message.channel.send(url); });
        if (message.channel.name === "nsfw-chambre") {
            message.delete();
        }
    }

    // Play sound from sound folder
    if (command === "play") {
        var voiceChannel = message.member.voiceChannel;
        if (voiceChannel != undefined) {
            // Check if the sound exist
            var sound = arrayOfSound.indexOf(firstParam) > -1 ? true : false;
            if (sound) {
                voiceChannel.join()
                    .then(connection => {
                        var dispatcher = connection.playFile("sound/" + firstParam + ".mp3");
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
        var voiceChannel = message.member.voiceChannel;
        if (voiceChannel != undefined) {
            // Play streams using ytdl-core
            const streamOptions = { seek: 0, volume: 0.4 };
            voiceChannel.join()
                .then(connection => {
                    let streamURL = message.content.split(" ")[1];
                    const stream = ytdl(streamURL, { filter: 'audioonly' });
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

    // Repeat message with the bot.
    if (command === "say") {
        var messageRepeat = message.content.substring(5, message.content.length);
        message.channel.send(messageRepeat);
        message.delete();
    }

    // Generate random number
    if (command === "rand") {
        var rand = Math.floor((Math.random() * parseInt(firstParam)) + 1);
        message.channel.send(rand);
    }

    // Send french wiki command with param
    if (command === "wiki") {
        let param = message.content.substring(6, message.content.length);
        let search = param.replace(/ /g, "_");
        let url = "https://fr.wikipedia.org/wiki/" + search;
        message.channel.send(url);
    }

    // Command for PM command
    if (command === "help") {
        if (firstParam === "sound")
            message.author.send(arrayOfSound);
        else
            message.author.send(help());
    }

    // Kick bot from voice channel
    if (command === "stop") {
        voiceChannel = message.member.voiceChannel;
        voiceChannel.leave();
    }

    // Force command for BM request
    if (command === "bm") {
        if (message.channel.name === "nsfw-chambre") {
            message.delete();
            bm();
        }
    }

    // Send 5 last log
    if (command === "log") {
        readLastLines.read("log.txt", 5)
            .then((lines) => bot.channels.get("259373236461109250").send(lines));
    }

    // Command joke
    if (command === "gouter") {
        let date = new Date();
        let hour = date.getHours();
        var response = "";

        if (hour >= 16 && hour < 17)
            response = "C'est l'heure du goûter ! :peach:";
        else if (hour >= 15 && hour < 16)
            response = "C'est bientôt l'heure du goûter ( ͡° ͜ʖ ͡°)";
        else
            response = "C'est pas l'heure du goûter. :cry:";

        message.channel.send(response);
    }

    // Second joke command
    if (command === "rosti") {
        let calcul = (parseInt(firstParam) / 20);
        message.channel.send("Cela fait ENVIRON " + (calcul * 60).toFixed() + " Rostis et " + (calcul * 10).toFixed() + " steaks.");
    }

});

// Function Help (Not Update)
function help() {
    let help = [".sb 'subreddit'",
        ".play 'sound'",
        ".gouter",
        ".say 'message'",
        ".wiki 'name'",
        ".help sound"];
    return help;
}

// Custom function for log
function log(message) {
    let date = moment().format("DD-MM-YY HH:mm:ss");
    let messageLog = "[" + date + "] " + message + "\n";
    fs.appendFile("log.txt", messageLog, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

// Get image of the day from Bonjour Madame
function bm() {
    request("http://dites.bonjourmadame.fr/", function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            var urlPhoto = $(".photo.post").find("img").attr("src");
            // Send URL in my NSFW channel. 
            bot.channels.get("109033916010110976").send(urlPhoto);
            log("Request BM OK");
        } else {
            log("error:" + error);
        }
    });
}

// Cron : Execute bm() at 10:20 Monday-Friday
cron.schedule("20 10 * * 1-5", function () {
    log("Cron start");
    bm();
});

// log bot
bot.login(config.token);