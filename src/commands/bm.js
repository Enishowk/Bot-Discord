const axios = require("axios");
const cheerio = require("cheerio");
const config = require("../../config/config.json");

module.exports = {
  name: "bm",
  description: "Return the BM's picture of the day.",
  async execute(message) {
    if (message.deletable) {
      message.delete();
    }
    const urlPhoto = await this.getURLFromBM();

    message.client.channels.get(config.nsfwChan).send(urlPhoto);
  },
  getURLFromBM() {
    return new Promise(resolve => {
      axios
        .get("http://dites.bonjourmadame.fr/")
        .then(response => {
          const $ = cheerio.load(response.data);
          const urlPhoto = $(".photo.post")
            .find("img")
            .attr("src");

          resolve(urlPhoto);
        })
        .catch(error => error);
    });
  },
};
