const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  name: "wiki",
  description: "Send french wiki command with param.",
  execute(message, args) {
    if (args.length === 0) {
      axios
        .get("https://fr.wikipedia.org/wiki/Special:Random")
        .then(response => {
          const $ = cheerio.load(response.data);
          const url = $('a[title="Voir le contenu de la page [c]"]').attr("href"); // eslint-disable-line

          message.channel.send(`https://fr.wikipedia.org${url}`);
        })
        .catch(error => error);
    } else {
      const search = args.join("_");
      const url = `https://fr.wikipedia.org/wiki/${search}`;
      message.channel.send(url);
    }
  },
};
