const axios = require("axios");

module.exports = {
  name: "yesno",
  description: "Return yes, or no.",
  async execute(message) {
    const response = await axios.get("https://yesno.wtf/api")

    return message.channel.send(response.data.answer);
  },
};
