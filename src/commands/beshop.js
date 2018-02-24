const axios = require("axios");

module.exports = {
  name: "beshop",
  description: "Return one joke",
  execute(message) {
    axios.get("http://api.yomomma.info/").then(response => {
      message.channel.send(response.data.joke);
    });
  },
};
