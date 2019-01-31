const axios = require("axios");

module.exports = {
  name: "yesno",
  description: "Return yes, or no.",
  execute(message) {
    axios
      .get("https://yesno.wtf/api")
      .then(response => {
        message.channel.send(response.data.answer);
      })
      .catch(error => error);
  },
};
