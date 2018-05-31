const axios = require("axios");
const Discord = require("discord.js");

module.exports = {
  name: "tr",
  description: "Send a question.",
  execute(message) {
    const decodeChar = str => str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));

    const sortAnswers = quiz => {
      const allAnswers = quiz.incorrect_answers;
      allAnswers.push(quiz.correct_answer);

      return allAnswers.sort();
    };

    axios
      .get("https://opentdb.com/api.php?amount=1&type=multiple")
      .then(response => {
        const quiz = response.data.results[0];
        const answers = sortAnswers(quiz);

        const richResponse = new Discord.RichEmbed()
          .setColor("#7ECEFD")
          .setTitle(decodeChar(quiz.question))
          .addBlankField(true)
          .addField(
            "Answers",
            `- ${decodeChar(answers[0])} \n- ${decodeChar(answers[1])} \n- ${decodeChar(answers[2])} \n- ${decodeChar(
              answers[3],
            )}`,
          )
          .setThumbnail(
            "https://upload.wikimedia.org/wikipedia/fr/thumb/2/2b/Logo-Qui-veut-gagner-des-millions.png/280px-Logo-Qui-veut-gagner-des-millions.png",
          );

        message.channel
          .send({ embed: richResponse })
          .then(() => {
            const filter = m => m.content.toLowerCase().includes(quiz.correct_answer.toLowerCase());
            const collector = message.channel.createMessageCollector(filter, { time: 15000 });

            collector.on("end", collected => {
              if (collected.size >= 1) {
                message.channel.send(`${collected.first().author} got the correct answer : **${quiz.correct_answer}**`);
              } else {
                message.channel.send(
                  `Looks like nobody got the answer this time. Correct Answer : **${quiz.correct_answer}**`,
                );
              }
            });
          })
          .catch(err => message.channel.send(`Error : ${err}`));
      })
      .catch(error => error);
  },
};
