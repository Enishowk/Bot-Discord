const axios = require("axios");

module.exports = {
  name: "beshop",
  description: "Return one joke",
  async execute(message) {
    const response = await axios.get("http://api.yomomma.info/")

    message.channel.send(response.data.joke);
  },
};
