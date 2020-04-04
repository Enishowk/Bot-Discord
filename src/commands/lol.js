const axios = require("axios");
const config = require("../../config/config.json");

const getMatchData = async (champions, match) => {
  const response = await axios.get(
    `https://euw1.api.riotgames.com/lol/match/v4/matches/${match.gameId}?api_key=${config.riotKey}`,
  );

  const stat = response.data.participants.find((participant) => participant.championId === match.champion);
  const gameMode = response.data.gameMode !== "CLASSIC" ? `(${response.data.gameMode}) ` : "";
  const gameCreation = new Date(response.data.gameCreation);
  const date = `${gameCreation.getDate()}/${
    gameCreation.getMonth() + 1
  }/${gameCreation.getFullYear()} ${gameCreation.getHours()}:${gameCreation.getMinutes().toString().padStart(2, "0")}`;
  const duration = Math.floor(response.data.gameDuration / 60);

  const teamData = response.data.teams.find((team) => team.win === "Win");
  const result = stat.teamId === teamData.teamId ? "WIN :slight_smile:" : "LOSE :rage:";
  const kda = `${stat.stats.kills}/${stat.stats.deaths}/${stat.stats.assists} - ${(
    (stat.stats.kills + stat.stats.assists) /
    stat.stats.deaths
  ).toFixed(2)} KDA`;
  const cs = stat.stats.totalMinionsKilled + stat.stats.neutralMinionsKilled;
  const championData = Object.values(champions).find((champion) => +champion.key === stat.championId);
  return `\n${date} ${gameMode}- ${duration}min - **${result}** - ${championData.name} - ${kda} (${cs} CS)`;
};

module.exports = {
  name: "lol",
  description: "Return matches history.",
  async execute(message, args) {
    if (args.length > 0) {
      try {
        const name = args[0];
        const champions = await axios.get("https://ddragon.leagueoflegends.com/cdn/10.7.1/data/en_US/champion.json");
        const responseSumm = await axios.get(
          `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${config.riotKey}`,
        );
        const responseMatches = await axios.get(
          `https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${responseSumm.data.accountId}?api_key=${config.riotKey}`,
        );
        const accountData = await axios.get(
          `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${responseSumm.data.id}?api_key=${config.riotKey}`,
        );

        const responsePromises = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const match of responseMatches.data.matches.slice(0, 5)) {
          responsePromises.push(getMatchData(champions.data.data, match));
        }
        const responses = await Promise.all(responsePromises);

        message.channel.send(
          `History of ${name} (${accountData.data[0].tier} ${accountData.data[0].rank} - ${
            accountData.data[0].leaguePoints
          }LP) : ${responses.join("")}`,
        );
      } catch (error) {
        message.channel.send("Erreur");
      }
    } else {
      message.channel.send("Miss parameter : name");
    }
  },
};
