var exports = module.exports = {};

exports.formatStat = (data) => {
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
};

exports.formatTeamName = (url) => {
  let newUrl = url.split('/');
  return newUrl[3].toUpperCase();
};

exports.formatTeamData = (data) => {
  data.forEach((value) => {
    value.btnText = 'View Players';
    value.className = 'nba-team';
    if (value.name === 'Philadelphia 76ers') {
      value.route = 'sixers';
    } else {
      value.route = value.name.split(' ').splice(-1)[0].toLowerCase();
    }
  });

  data.push({
    route: 'ncaa',
    btnText: 'View Teams',
    className: 'ncaa',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/NCAA_logo.svg/1200px-NCAA_logo.svg.png'
  });

  return data;
};

exports.formatPlayerData = (data) => {
  let arr = [];
  for (let item of data) {
    let split = item.split(' ');
    arr.push(...split);
  }
  let filtered = arr.filter(i => i !== '');
  let inches = filtered[1].split('in');
  let weight = filtered[2].split('in');
  let inch = inches[0].split('ft')
  let height = `${filtered[0]}ft, ${inch[1]}in`;

  return {
    height: height,
    weight: weight[1],
    dob: filtered[4],
    age: filtered[6]
  };
};

exports.formatSchoolList = (data) => {
  for (let school of data) {
    let name = school.teamName.split('-');
    school.teamName = formatStrings(name).join(' ');
  }
  return data;
};

const formatStrings = (team) => {
  for (let i = 0; i < team.length; i++) {
    if (team[i] === '%26') { team[i] = '&'; }
    if (team[i] === 'a%26m') { team[i] = 'A&M'; }
    if (team[i] === 'jos%C3%A9') { team[i] = 'Jose'; }
    if (team[i] === 'a%26t') { team[i] = 'A&T'; }
    team[i] = team[i].charAt(0).toUpperCase() + team[i].slice(1);
  }
  return team;
};
