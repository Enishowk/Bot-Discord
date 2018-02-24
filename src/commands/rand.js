module.exports = {
  name: "rand",
  description: "Generate random number.",
  execute(message, args) {
    const rand = Math.floor(Math.random() * parseInt(args[0] || 100, 10) + 1);
    message.channel.send(rand);
  },
};
