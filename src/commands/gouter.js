module.exports = {
  name: "gouter",
  description: "Il est l'heure du gouter ?",
  execute(message) {
    const date = new Date();
    const hour = date.getHours();
    let response = "";

    if (hour >= 16 && hour < 17) {
      response = "C'est l'heure du goûter ! :peach:";
    } else if (hour >= 15 && hour < 16) {
      response = "C'est bientôt l'heure du goûter ( ͡° ͜ʖ ͡°)";
    } else {
      response = "C'est pas l'heure du goûter. :cry:";
    }

    message.channel.send(response);
  },
};
