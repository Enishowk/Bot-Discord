module.exports = {
  name: "rosti",
  description: "Calcul de Rösti.",
  execute(message, args) {
    if (args.length > 0) {
      const calcul = parseInt(args[0], 10) / 20;
      message.channel.send(`Cela fait ENVIRON ${(calcul * 60).toFixed()} rösti et ${(calcul * 10).toFixed()} steaks.`);
    } else {
      message.channel.send("Il manque un paramètre [nombre]");
    }
  },
};
