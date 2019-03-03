export function formatHeaders(headers) {
  headers = Object.keys(headers)
    .filter(n => n !== 'SEASON' && n !== 'TEAM_ABBREVIATION' && n !== 'TeamID' && n !== 'TEAM_ID' && n !== 'LeagueID' && n !== 'PLAYER_ID')
    .map(k => {
      if (k.includes('_')) {
        if (k.includes('_ID')) {
          k = k.replace(/_ID/g, "");
        } else {
          k = k.replace(/_/g, " ");
        }

      }

      return k;
    });

  return headers;
}

export function formatStat(data) {
  const { headers, rowSet } = data.resultSets[0];
  let players = [];

  for (var i = 0; i < rowSet.length; i++) {
      const data = rowSet[i];
      const player = Object.assign(...headers.map((k, i) => ({[k]: data[i]})));

      players.push(player);
  }

  return players;
}

export function formatPlayerStats(data) {
  const { headers, rowSet } = data;
  let seasons = [];

  for (var i = 0; i < rowSet.length; i++) {
      const data = rowSet[i];
      const season = Object.assign(...headers.map((k, i) => ({[k]: data[i]})));

      seasons.push(season);
  }

  return seasons.reverse();
}

export function formatPlayerData(data) {
  const { headers, rowSet } = data;
  let info = rowSet[0];

  const playerData = Object.assign(...headers.map((k, i) => ({[k]: info[i]})));

  return playerData;
}