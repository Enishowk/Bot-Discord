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
    this.getURLFromBM().then(urlPhoto => {
      message.client.channels.get(config.nsfwChan).send(urlPhoto);
    });
  },
  getURLFromBM() {
    return axios
      .get("http://dites.bonjourmadame.fr/")
      .then(response => {
        const $ = cheerio.load(response.data);
        const urlPhoto = $(".photo.post")
          .find("img")
          .attr("src");

        return urlPhoto;
      })
      .catch(error => error);
  },
};
