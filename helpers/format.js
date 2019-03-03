export function formatStat(data) {
  const { headers, rowSet } = data.resultSets[0];
  let players = [];

  for (var i = 0; i < rowSet.length; i++) {
      const data = rowSet[i];

      const player = Object.assign(...headers.map((k, i) => ({[k]: data[i]})))

      players.push(player);
  }

  return players;
}

export function formatTeamData (data) {
  return data.map(team => {
      team.imgUrl = `https://www.nba.com/assets/logos/teams/primary/web/${team.tricode}.svg`

      return team;
  });
}

export function formatPlayerStats(data) {
  const { headers, rowSet } = data;
  let seasons = [];

  for (var i = 0; i < rowSet.length; i++) {
      const data = rowSet[i];
      const season = Object.assign(...headers.map((k, i) => ({[k]: data[i]})))

      seasons.push(season);
  }

  return seasons.reverse();
}

export function formatPlayerData(data) {
  const { headers, rowSet } = data;
  let info = rowSet[0];

  const playerData = Object.assign(...headers.map((k, i) => ({[k]: info[i]})))

  return playerData;
}