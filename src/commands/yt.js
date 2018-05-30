const ytdl = require("ytdl-core");
const config = require("../../config/config.json");

module.exports = {
  name: "yt",
  description: "Play youtube song.",
  execute(message, args, bot) {
    const { voiceChannel } = message.member;
    if (voiceChannel !== undefined) {
      const streamOptions = { seek: 0, volume: 0.3, bitrate: "auto" };
      const stream = ytdl(args[0], { filter: "audioonly" });

      // If already in channel, change music
      if (bot.voiceConnections.size === 1) {
        bot.voiceConnections.get(config.guildID).playStream(stream, streamOptions);
      } else {
        voiceChannel
          .join()
          .then(connection => {
            // Play youtube song
            connection.playStream(stream, streamOptions);

            // Check if song is playing every 20 seconds.
            let intervalId = null;
            const isStreamOn = () => {
              // If bot is connected but not speaking.
              if (bot.voiceConnections.size > 0 && !bot.voiceConnections.get(config.guildID).speaking) {
                clearInterval(intervalId);
                voiceChannel.leave();
              }
              // If bot is disconnected from voice channel
              if (bot.voiceConnections.size === 0) {
                clearInterval(intervalId);
              }
            };
            intervalId = setInterval(isStreamOn, 20000);
          })
          .catch(console.error);
      }
    } else {
      message.channel.send("Tu n'es pas dans un chan vocal.");
    }
  },
};
