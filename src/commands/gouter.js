module.exports = {
  name: "gouter",
  description: "Est-ce qu'il est l'heure de goûter ?",
  execute(message) {
    const date = new Date();
    const hour = date.getHours();

    if (hour >= 16 && hour < 17) {
      return message.channel.send("C'est l'heure du goûter ! :peach:");
    }
    if (hour >= 15 && hour < 16) {
      return message.channel.send("C'est bientôt l'heure du goûter ( ͡° ͜ʖ ͡°)");
    }

    return message.channel.send("C'est pas l'heure du goûter. :cry:");
  },
};
