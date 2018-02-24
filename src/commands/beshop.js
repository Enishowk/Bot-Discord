const oneLinerJoke = require("one-liner-joke");

module.exports = {
  name: "beshop",
  description: "Return one joke",
  execute(message) {
    const getRandomJoke = oneLinerJoke.getRandomJoke();
    message.channel.send(getRandomJoke.body);
  },
};
