const cheerio = require("cheerio");
const request = require("request");

module.exports = {
  help() {
    return [
      ".sb 'subreddit'",
      ".play 'sound'",
      ".yt 'link'",
      ".stop",
      ".say 'message'",
      ".rand 'number'",
      ".wiki 'name'",
      ".bm",
      ".gouter",
      ".rosti 'number'",
      ".help sound",
      ".bitcoin",
    ];
  },
  bm() {
    return new Promise((resolve, reject) => {
      request("http://dites.bonjourmadame.fr/", (error, response, html) => {
        if (!error && response.statusCode === 200) {
          const $ = cheerio.load(html);
          const urlPhoto = $(".photo.post")
            .find("img")
            .attr("src");

          resolve(urlPhoto);
        } else {
          reject(error);
        }
      });
    });
  },
  bitcoin() {
    return new Promise((resolve, reject) => {
      request(
        {
          url: "https://api.coindesk.com/v1/bpi/currentprice.json",
          headers: {
            "User-Agent": "request",
          },
        },
        (error, response, body) => {
          if (!error && response.statusCode === 200) {
            const info = JSON.parse(body);
            const valueUSD = info.bpi.USD.rate_float.toLocaleString("fr-FR", { style: "currency", currency: "USD" });
            const valueEUR = info.bpi.EUR.rate_float.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

            resolve([valueUSD, valueEUR]);
          } else {
            reject(error);
          }
        },
      );
    });
  },
};
