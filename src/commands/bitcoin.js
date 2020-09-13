const axios = require("axios");
const Discord = require("discord.js");

const getBitcoinValues = async () => {
  const response = await axios.get("https://api.coinbase.com/v2/exchange-rates?currency=BTC")
  const rates = response.data.data.rates;

  const valueUSD = Number(rates.USD).toLocaleString("fr-FR", {
    style: "currency",
    currency: "USD",
  });
  const valueEUR = Number(rates.EUR).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  return { valueUSD, valueEUR }
}

module.exports = {
  name: "bitcoin",
  description: "Return the Bitcoin value from coinbase.",
  async execute(message) {
    const { valueUSD, valueEUR } = await getBitcoinValues()

    const richResponse = new Discord.MessageEmbed()
      .setColor("#f39c12")
      .addField("BITCOIN", `${valueUSD}, soit ${valueEUR}`)
      .setThumbnail("https://image.freepik.com/free-vector/golden-coin-with-word-bitcoin_1308-9855.jpg")
      .setTimestamp();

    message.channel.send(richResponse);
  }
}
