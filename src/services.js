const cheerio = require("cheerio");
const axios = require("axios");
const moment = require("moment");
const config = require("../config/config.json");

module.exports = {
  help() {
    return [
      ".sb 'subreddit'",
      ".play 'sound'",
      ".yt 'link'",
      ".stop",
      ".say 'message'",
      ".rand 'number'",
      ".wiki 'name'",
      ".bm",
      ".gouter",
      ".rosti 'number'",
      ".help sound",
      ".bitcoin",
    ];
  },
  bm() {
    return axios
      .get("http://dites.bonjourmadame.fr/")
      .then(response => {
        const $ = cheerio.load(response.data);
        const urlPhoto = $(".photo.post")
          .find("img")
          .attr("src");

        return urlPhoto;
      })
      .catch(error => error);
  },
  bitcoin() {
    return axios
      .get("https://api.coindesk.com/v1/bpi/currentprice.json")
      .then(response => {
        const info = response.data.bpi;
        const valueUSD = info.USD.rate_float.toLocaleString("fr-FR", {
          style: "currency",
          currency: "USD",
        });
        const valueEUR = info.EUR.rate_float.toLocaleString("fr-FR", {
          style: "currency",
          currency: "EUR",
        });

        return [valueUSD, valueEUR];
      })
      .catch(error => error);
  },
  redmine(begin = null, end = null) {
    const firstDayMonth =
      begin ||
      moment()
        .startOf("month")
        .format("YYYY-MM-DD");
    const lastDayMonth =
      end ||
      moment()
        .endOf("month")
        .format("YYYY-MM-DD");
    return axios
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

        return resp;
      })
      .catch(error => error);
  },
  predmine(issueId = "7311", date = null, hours = 8) {
    const now = date || moment().format("YYYY-MM-DD");
    return axios({
      method: "post",
      url: "http://redmine.smartpanda.fr/time_entries.json",
      headers: { "X-Redmine-API-Key": config.redmineToken },
      data: {
        time_entry: {
          project_id: 31,
          issue_id: issueId,
          spent_on: now,
          hours,
          activity_id: 9,
          comments: "",
        },
      },
    })
      .then(response => {
        const formatResponse = `${response.status} : http://${config.redmineUrl}/time_entries/${response.data.time_entry
          .id}/edit`;
        return formatResponse;
      })
      .catch(error => error);
  },
};
