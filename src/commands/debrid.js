const axios = require("axios");
const Discord = require("discord.js");
const prettyBytes = require("pretty-bytes");

const BASE_URL = "https://api.alldebrid.com/v4";

module.exports = {
  name: "debrid",
  description: "Return link from all debrid",
  async execute(message, args) {
    const link = args[0];

    try {
      const { data } = await axios.get(
        `${BASE_URL}/link/unlock?agent=botDiscord&apikey=${process.env.ALLDEDRID_KEY}&link=${link}`,
      );
      if (data.status === "error") {
        throw data.error;
      }

      const richResponse = new Discord.MessageEmbed()
        .setColor("#FCC433")
        .addField("NAME", data.data.filename)
        .addField("SIZE", prettyBytes(data.data.filesize, { binary: true }))
        .addField("LINK", data.data.link)
        .setThumbnail("https://cdn.alldebrid.com/lib/images/default/logo_alldebrid.png");

      console.info(message.author.username, data.data.filename);
      message.channel.send(richResponse);
    } catch (error) {
      console.error("allDebrid", error);
      message.channel.send(error.message);
    }
  },
};
