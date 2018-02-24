const ytdl = require("ytdl-core");

module.exports = {
  name: "yt",
  description: "Play youtube song.",
  execute(message, args) {
    const { voiceChannel } = message.member;
    if (voiceChannel !== undefined) {
      const streamOptions = { seek: 0, volume: 1 };
      voiceChannel
        .join()
        .then(connection => {
          const stream = ytdl(args[0], { filter: "audioonly" });
          const dispatcher = connection.playStream(stream, streamOptions);
          dispatcher.on("end", () => {
            voiceChannel.leave();
          });
        })
        .catch(console.error);
    } else {
      message.channel.send("Tu n'es pas dans un chan vocal.");
    }
  },
};
