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
};
