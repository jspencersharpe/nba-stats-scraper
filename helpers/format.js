var exports = module.exports = {};

exports.formatStat = (data) => {
  data.forEach((value, index) => {
    if (value.gp === "") value.gp = "-";
    if (value.pts === "") value.pts = "-";
    if (value.fg_pct === "") value.fg_pct = "-";
    if (value.fg3_pct === "") value.fg3_pct = "-";
    if (value.ft_pct === "") value.ft_pct = "-";
    if (value.ast === "") value.ast = "-";
    if (value.reb === "") value.reb = "-";
    if (value.oreb === "") value.oreb = "-";
    if (value.dreb === "") value.dreb = "-";
    if (value.stl === "") value.stl = "-";
    if (value.tov === "") value.tov = "-";
    if (value.pf === "") value.pf = "-";
  });

  return data;
}

exports.formatTeamName = (url) => {
  let newUrl = url.split('/');
  return newUrl[3].toUpperCase();
}

exports.formatTeamData = (data) => {
  data.forEach((value, index) => {
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
    url: 'https://pbs.twimg.com/profile_images/188987758/NCAA_primaryc.gif',
    route: '/ncaa'
  });

  return data;
}
