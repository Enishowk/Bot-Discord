module.exports = {
  name: "stop",
  description: "Kick bot from voice channel",
  execute(message) {
    const { voiceChannel } = message.member;
    voiceChannel.leave();
  },
};
