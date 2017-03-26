const express = require('express');
const app = express();
const path = require('path');
const nbaService = require('./services/nba.service');
const ncaaService = require('./services/ncaa.service');
const teamService = require('./services/teams.service');
const format = require('./helpers/format');

app.set('view engine', 'jade');

app.get('/', (req, res) => {
  let url = 'http://www.nba.com/teams';
  teamService.getTeamList(url, (teamData) => {
    let teamsList = format.formatTeamData(teamData);
    res.render('index', {
      teamsList: teamsList
    });
  })
});

app.get('/ncaa/', (req, res) => {
  let team = req.params.ncaa;
  let url = 'http://espn.go.com/mens-college-basketball/teams';
  ncaaService.getNCAAIDs(url, (schoolData) => {
    res.render('includes/ncaa', {
      schoolData: schoolData
    });
  });
});

app.get('/:team', (req, res) => {
  let team = req.params.team;
  let url = 'http://www.nba.com/' + team + '/stats';
  if (team == 'mavericks') {
    res.render('includes/mavs');
    return;
  }

  nbaService.getNBAData(url, (jsonData) => {
    let playerData = format.formatStat(jsonData.playerData);
    let teamData = jsonData.teamData;
    res.render('includes/stats', {
      playerData: playerData,
      team: format.formatTeamName(url),
      teamData: teamData
    })
  });
});

app.listen(process.env.PORT || 3333)
console.log('Running on 3333');
exports = module.exports = app;
