const axios = require("axios");
const cheerio = require("cheerio");
const config = require("../../config/config.json");

module.exports = {
  name: "bm",
  description: "Return the BM's picture of the day.",
  execute(message) {
    if (message.deletable) {
      message.delete();
    }
    axios
      .get("http://dites.bonjourmadame.fr/")
      .then(response => {
        const $ = cheerio.load(response.data);
        const urlPhoto = $(".photo.post")
          .find("img")
          .attr("src");

        message.client.channels.get(config.nsfwChan).send(urlPhoto);
      })
      .catch(error => error);
  },
};
