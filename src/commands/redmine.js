const axios = require("axios");
const moment = require("moment");
const config = require("../../config/config.json");

module.exports = {
  name: "redmine",
  description: "Get Redmine of month.",
  execute(message, args) {
    if (message.author.id === config.userAdmin) {
      const firstDayMonth =
        args[0] ||
        moment()
          .startOf("month")
          .format("YYYY-MM-DD");
      const lastDayMonth =
        args[1] ||
        moment()
          .endOf("month")
          .format("YYYY-MM-DD");
      axios
        .get(
          `http://redmine.smartpanda.fr/time_entries.json?spent_on=><${firstDayMonth}|${lastDayMonth}&user_id=${config.redmineId}`,
          {
            headers: { "X-Redmine-API-Key": config.redmineToken },
          },
        )
        .then(response => {
          const entries = response.data.time_entries;
          const jourTravaille = response.data.total_count;
          const resp = [];

          resp.push(`Jour enregistré : ${jourTravaille}`);

          entries.forEach(entry => {
            const issue = entry.issue ? `(${entry.issue.id}) http://${config.redmineUrl}/issues/${entry.issue.id}` : "";
            resp.push(`${entry.spent_on} > ${entry.hours} > ${entry.activity.name} ${issue} ${entry.comments}`);
          });

          resp.push(`---- Recap de la période du ${firstDayMonth} au ${lastDayMonth} ----`);

          message.channel.send(resp.reverse());
        })
        .catch(error => message.channel.send(`${error.response.status} : ${error.response.statusText}`));
    }
  },
  isLogDayDone() {
    const today = moment().format("YYYY-MM-DD");
    return new Promise(resolve => {
      axios
        .get(
          `http://redmine.smartpanda.fr/time_entries.json?spent_on=><${today}|${today}&user_id=${config.redmineId}`,
          {
            headers: { "X-Redmine-API-Key": config.redmineToken },
          },
        )
        .then(response => {
          if (response.data.total_count === 0) {
            resolve(false);
          }
        });
    });
  },
};
