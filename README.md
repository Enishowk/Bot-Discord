# Bot-Discord

## Installation

```sh
$ git clone https://github.com/Enishowk/Bot-Discord.git
$ cd Bot-Discord
$ npm install
$ npm install -g ytdl
```

- **Don't forget to rename `config.json.dist` to `config.json` and add your Token.**
- Create a sound folder with your different sound.

To start the bot in background with pm2.

```sh
$ pm2 start src/bot.js
```

Check [PM2 Wiki](https://github.com/Unitech/pm2/wiki) for more command.

## Command

- .beshop - Get random joke.
- .bitcoin - Get value of Bitcoin.
- .gouter - Joke command for french.
- .help [sound] - Command list. Sound list with sound param.
- .meteo [city] - Return Weather for City param.
- .play [sound] - Play a sound in Voice channel.
- .rand [number] - Simple rand command.
- .say [message] - Bot repeat your message.
- .sb [subreddit] - Get random picture from Subreddit (Default 'aww' subreddit).
- .stop - Kick bot from voice channel.
- .tr - Send random question from Trivial Pursuit.
- .wiki [subject] - Link page from wikipedia.
- .yesno - Return yes, or no.
- .yt [link] - Play a video from YouTube.

## Troubleshooting

ERR! stack Error: not found: make

```sh
$ sudo apt-get install build-essential
```

Bot don't play sound

```sh
$ sudo apt-get install ffmpeg
$ npm install node-opus
```

Issue with node-gyp (Catalina)
```sh
$ sudo rm -rf $(xcode-select -print-path)
$ xcode-select --install
$ /usr/sbin/pkgutil --packages | grep CL
$ sudo npm install -g node-gyp
```

[Discord JS](https://github.com/hydrabolt/discord.js/)
