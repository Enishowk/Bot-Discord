const randomPuppy = require("random-puppy");

module.exports = {
  name: "sb",
  description: "Get one random image from a subreddit",
  async execute(message, args) {
    const subredditName = args !== undefined ? args[0] : "aww";
    const url = await randomPuppy(subredditName)
      if (message.channel.nsfw) {
        message.delete();
      }
    return message.channel.send(url);
  }
};
