export function formatStat(data) {
  data.forEach((value) => {
    if (value.gp === '') { value.gp = '-'; }
    if (value.pts === '') { value.pts = '-'; }
    if (value.fg_pct === '') { value.fg_pct = '-'; }
    if (value.fg3_pct === '') { value.fg3_pct = '-'; }
    if (value.ft_pct === '') { value.ft_pct = '-'; }
    if (value.ast === '') { value.ast = '-'; }
    if (value.reb === '') { value.reb = '-'; }
    if (value.oreb === '') { value.oreb = '-'; }
    if (value.dreb === '') { value.dreb = '-'; }
    if (value.stl === '') { value.stl = '-'; }
    if (value.tov === '') { value.tov = '-'; }
    if (value.pf === '') { value.pf = '-'; }
  });

  return data;
}

export function formatTeamName(url) {
  let newUrl = url.split('/');
  return newUrl[3].toUpperCase();
}

export function formatTeamData (data) {
  data.forEach((value) => {
    value.btnText = 'View Players';
    value.className = 'nba-team';
    if (value.name === 'Philadelphia 76ers') {
      value.route = 'sixers';
    } else {
      value.route = value.name.split(' ').splice(-1)[0].toLowerCase();
    }
  });

  return data;
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
