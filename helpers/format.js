export function formatStat(data) {
    const { headers, rowSet } = data.resultSets[0];
    let players = [];

    for (var i = 0; i < rowSet.length; i++) {
        let player = {};

        rowSet[i].map((d, idx) => {
            return Object.assign(player, {[headers[idx]]: d});
        });

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

export function formatPlayerData(data) {
  let arr = [];
  for (let item of data) {
    let split = item.split(' ');
    arr.push(...split);
  }

  let filtered = arr.filter(i => i !== '');
  let inches = filtered[1].split('in');
  let weight = filtered[2].split('in');
  let inch = inches[0].split('ft');
  let height = `${filtered[0]}ft, ${inch[1]}in`;

  return {
    height: height,
    weight: weight[1],
    dob: filtered[4],
    age: filtered[6]
  };
}
