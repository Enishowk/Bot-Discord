const Discord = require("discord.js");
const randomPuppy = require("random-puppy");
const fs = require("fs");
const cron = require("node-cron");
const request = require("request");
const cheerio = require("cheerio"); //Parse html 
const moment = require("moment");
const readLastLines = require("read-last-lines");
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

    // Get one image from a subreddit
    if (command === "sb") {
        let subreddit = firstParam != undefined ? firstParam : "aww";
        randomPuppy(subreddit).then(url => { message.channel.sendMessage(url); });
        if (message.channel.name === "chambre") {
            message.delete();
        }
    }

    // Play song
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
                message.channel.sendMessage("Le son " + firstParam + " n'existe pas.");
            }
        } else {
            message.channel.sendMessage("Tu n'es pas dans un chan vocal.");
        }
    }

    // Command joke
    if (command === "gouter") {
        let date = new Date();
        let hour = date.getHours();
        var response = "";

        if (hour >= 16 && hour < 17)
            response = "C'est l'heure du goûter ! :doughnut:";
        else if (hour >= 15 && hour < 16)
            response = "C'est bientôt l'heure du goûter ( ͡° ͜ʖ ͡°)";
        else
            response = "C'est pas l'heure du goûter. :cry:";

        message.channel.sendMessage(response);
    }

    // Command repeat
    if (command === "say") {
        var messageRepeat = message.content.substring(5, message.content.length);
        message.channel.sendMessage(messageRepeat);
        message.delete();
    }

    if (command === "wiki") {
        let param = message.content.substring(6, message.content.length);
        let search = param.replace(/ /g, "_");
        let url = "https://fr.wikipedia.org/wiki/" + search;
        message.channel.sendMessage(url);
    }

    // Command for PM command
    if (command === "help") {
        if (firstParam === "sound")
            message.author.sendMessage(arrayOfSound);
        else
            message.author.sendMessage(help());
    }

    // Kick bot from voice channel
    if (command === "stop") {
        voiceChannel = message.member.voiceChannel;
        voiceChannel.leave();
    }

    if (command === "bm") {
        if (message.channel.name === "chambre") {
            message.delete();
            bm();
        }
    }

    //Log file
    if (command === "log") {
        readLastLines.read("log.txt", 5)
            .then((lines) => bot.channels.get("259373236461109250").sendMessage(lines));
    }

});

function help() {
    let help = [".sb 'subreddit'",
        ".play 'sound'",
        ".gouter",
        ".say 'message'",
        ".wiki 'name'",
        ".help sound"];
    return help;
}

function log(message) {
    let date = moment().format("DD-MM-YY HH:mm:ss");
    let messageLog = "[" + date + "] " + message + "\n";
    fs.appendFile("log.txt", messageLog, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

function bm(){
    request("http://dites.bonjourmadame.fr/", function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            var urlPhoto = $(".photo.post").find("img").attr("src");
            bot.channels.get("109033916010110976").sendMessage(urlPhoto);
            log("Request BM OK");
        } else {
            log("error:" + error);
        }
    });
}

// Cron for specific channel
cron.schedule("20 10 * * *", function () {
    log("Cron start");
    bm();
});

// log bot
bot.login(config.token);