const axios = require("axios");
const moment = require("moment");
const config = require("../../config/config.json");

module.exports = {
  name: "predmine",
  description: "Post redmine.",
  execute(message, args) {
    if (message.author.id === config.userAdmin) {
      const issue_id = args[0] || "7807"; // eslint-disable-line
      const spent_on = args[1] || moment().format("YYYY-MM-DD"); // eslint-disable-line
      const hours = args[2] || 8;
      axios({
        method: "post",
        url: "http://redmine.smartpanda.fr/time_entries.json",
        headers: { "X-Redmine-API-Key": config.redmineToken },
        data: {
          time_entry: {
            project_id: 31,
            issue_id,
            spent_on,
            hours,
            activity_id: 9,
            comments: "",
          },
        },
      })
        .then(response => {
          const formatResponse = `${response.status} : http://${config.redmineUrl}/time_entries/${response.data
            .time_entry.id}/edit`;
          message.channel.send(formatResponse);
        })
        .catch(error => message.channel.send(`${error.response.status} : ${error.response.statusText}`));
    }
  },
};
