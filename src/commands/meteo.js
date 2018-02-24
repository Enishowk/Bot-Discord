module.exports = {
  name: "meteo",
  description: "Return the weather.",
  execute(message, args) {
    if (args.length > 0) {
      if (args[1] && args[1] === "demain") {
        message.channel.send(`https://www.prevision-meteo.ch/uploads/widget/${args[0]}_1.png`);
      } else {
        message.channel.send(`https://www.prevision-meteo.ch/uploads/widget/${args[0]}_0.png`);
      }
    } else {
      message.channel.send("Il manque un paramètre [ville]");
    }
  },
};
