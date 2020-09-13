const calculRosti = (amount) => {
  const calcul = parseInt(amount, 10) / 20;
  const rosti = (calcul * 60).toFixed()
  const steaks = (calcul * 10).toFixed()

  return { rosti, steaks }
}

module.exports = {
  name: "rosti",
  description: "Calcul de Rösti.",
  execute(message, args) {
    if (args.length > 0) {
      const { rosti, steaks } = calculRosti(args[0])
      return message.channel.send(`Cela fait ENVIRON ${rosti} rösti et ${steaks} steaks.`);
    }

    return message.channel.send("Il manque un paramètre [nombre]");
  },
};
