const cheerio = require("cheerio");
const axios = require("axios");
const moment = require("moment");
const config = require("../config/config.json");

const today = moment().format("YYYY-MM-DD");
const firstDayMonth = moment()
  .startOf("month")
  .format("YYYY-MM-DD");
const lastDayMonth = moment()
  .endOf("month")
  .format("YYYY-MM-DD");

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
  redmine(begin = firstDayMonth, end = lastDayMonth) {
    return axios
      .get(`http://redmine.smartpanda.fr/time_entries.json?spent_on=><${begin}|${end}&user_id=${config.redmineId}`, {
        headers: { "X-Redmine-API-Key": config.redmineToken },
      })
      .then(response => {
        const entries = response.data.time_entries;
        const jourTravaille = response.data.total_count;
        const resp = [];

        resp.push(`Jour enregistré : ${jourTravaille}`);

        entries.forEach(entry => {
          const issue = entry.issue ? `(${entry.issue.id}) http://${config.redmineUrl}/issues/${entry.issue.id}` : "";
          resp.push(`${entry.spent_on} > ${entry.hours} > ${entry.activity.name} ${issue} ${entry.comments}`);
        });

        resp.push(`---- Recap de la période du ${begin} au ${end} ----`);

        return resp;
      })
      .catch(error => error);
  },
  predmine(issueId = "7311", date = today, hours = 8) {
    return axios({
      method: "post",
      url: "http://redmine.smartpanda.fr/time_entries.json",
      headers: { "X-Redmine-API-Key": config.redmineToken },
      data: {
        time_entry: {
          project_id: 31,
          issue_id: issueId,
          spent_on: date,
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
