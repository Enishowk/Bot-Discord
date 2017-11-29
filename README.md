# Bot-Discord

## Installation
* **Don't forget to add your Token in `config.js` file.**
* Create a sound folder with your different sound.

Install the dependencies and start the server.
```sh
$ npm install
$ node bot.js
```

To start the bot in background with pm2.
```sh
$ pm2 start bot.js
```
Check [PM2 Wiki](https://github.com/Unitech/pm2/wiki) for more command.


## Command

* .sb [subreddit] - Get random picture from Subreddit (Default 'aww' subreddit).
* .play [sound] - Play a sound in Voice channel.
* .yt [link] - Play a video from YouTube.
* .stop - Kick bot from voice channel.
* .gouter - Joke command for french.
* .say [message] - Bot repeat your message.
* .rand [number] - Simple rand command.
* .wiki [subject] - Link page from wikipedia.
* .bm - Specific command to get a picture from the website bonjourmadame.fr. Don't forget to change ID of your NSFW channel in config file.
* .bitcoin - Get value of Bitcoin.
* .help [sound] - Command list. Sound list with sound param.

[Discord JS](https://github.com/hydrabolt/discord.js/)
