const randomPuppy = require("random-puppy");

module.exports = {
  name: "sb",
  description: "Get one random image from a subreddit",
  execute(message, args) {
    const subredditName = args !== undefined ? args[0] : "aww";
    randomPuppy(subredditName).then(url => {
      message.channel.send(url);
      if (message.channel.nsfw) {
        message.delete();
      }
    });
  },
};
