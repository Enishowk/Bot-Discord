const axios = require("axios");

module.exports = {
  name: "bitcoin",
  description: "Return the Bitcoin value.",
  execute(message) {
    axios
      .get("https://api.coinbase.com/v2/exchange-rates?currency=BTC")
      .then(response => {
        const info = response.data.data.rates;
        const valueUSD = Number(info.USD).toLocaleString("fr-FR", {
          style: "currency",
          currency: "USD",
        });
        const valueEUR = Number(info.EUR).toLocaleString("fr-FR", {
          style: "currency",
          currency: "EUR",
        });

        message.channel.send(`La valeur du bitcoin est de : ${valueUSD}, soit ${valueEUR}`);
      })
      .catch(error => error);
  },
};
