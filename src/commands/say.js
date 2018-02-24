module.exports = {
  name: "say",
  description: "Repeat message with the bot.",
  execute(message, args) {
    const messageRepeat = args.join(" ");
    message.channel.send(messageRepeat);
    if (message.deletable) {
      message.delete();
    }
  },
};
