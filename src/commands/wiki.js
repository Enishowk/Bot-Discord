const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  name: "wiki",
  description: "Send french wiki command with param.",
  async execute(message, args) {
    if (args.length === 0) {
      const response = await axios.get("https://fr.wikipedia.org/wiki/Special:Random")
      const $ = cheerio.load(response.data);
      const url = $('a[title="Voir le contenu de la page [c]"]').attr("href");

      return message.channel.send(`https://fr.wikipedia.org${url}`);
    }
    const search = args.join("_");
    const url = `https://fr.wikipedia.org/wiki/${search}`;
    return message.channel.send(url);
  },
};
