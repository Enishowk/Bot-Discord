const axios = require("axios");
const moment = require("moment");
const config = require("../config/config.json");

const date = moment();
const firstDayMonth = date.startOf("month").format("YYYY-MM-DD");
const lastDayMonth = date.endOf("month").format("YYYY-MM-DD");
const test2 = moment().days();

// axios({
//   method: "post",
//   url: "http://redmine.smartpanda.fr/time_entries.json",
//   headers: { "X-Redmine-API-Key": config.redmineToken },
//   data: {
//     time_entry: {
//       project_id: 31,
//       issue_id: 7311,
//       spent_on: "2017-12-05",
//       hours: 8,
//       activity_id: 9,
//       comments: "",
//     },
//   },
// }).then(response => {
//   console.log(response.status);
// });

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
    console.log("Jour enregistré :", jourTravaille);

    entries.forEach(entry => {
      console.log(entry.spent_on, entry.hours, entry.activity.name);
    });
  })
  .catch(error => {
    console.log("error", error);
  });
