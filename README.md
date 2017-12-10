# Bot-Discord

## Installation

* **Don't forget to rename `config.json.dist` to `config.json` and add your Token.**
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

* .bitcoin - Get value of Bitcoin.
* .bm - Specific command to get a picture from the website bonjourmadame.fr. Don't forget to change ID of your NSFW channel in config file.
* .gouter - Joke command for french.
* .help [sound] - Command list. Sound list with sound param.
* .meteo [city] - Return Weather for City param.
* .play [sound] - Play a sound in Voice channel.
* .predmine [projectID] [date] [hour] - Post a new time_entries in Redmine.
* .rand [number] - Simple rand command.
* .redmine [date] [date] - Get logtime between date.
* .say [message] - Bot repeat your message.
* .sb [subreddit] - Get random picture from Subreddit (Default 'aww' subreddit).
* .stop - Kick bot from voice channel.
* .wiki [subject] - Link page from wikipedia.
* .yt [link] - Play a video from YouTube.

[Discord JS](https://github.com/hydrabolt/discord.js/)
