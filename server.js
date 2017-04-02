const express = require('express');
const app = express();
const path = require('path');
const orderBy = require('lodash.orderby');
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
  });
});

app.get('/ncaa/', (req, res) => {
  let team = req.params.ncaa;
  let url = 'http://espn.go.com/mens-college-basketball/teams';
  ncaaService.getNCAAIDs(url, (schoolData) => {
    let orderedSchoolData = orderBy(schoolData, ['teamName'], ['asc']);
    res.render('includes/ncaa', {
      schoolData: format.formatSchoolList(orderedSchoolData)
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
    });
  });
});

app.get('/player/:playerId', (req, res) => {
  let playerId = req.params.playerId;
  let url = 'http://www.nba.com/playerfile/' + playerId;

  nbaService.getPlayerData(url, (jsonData) => {
    let playerObj = jsonData;
    playerObj.data = format.formatPlayerData(jsonData.rawInfo);
    res.render('includes/player', {playerObj});
  });
});

app.listen(process.env.PORT || 3333)
console.log('Running on 3333');
exports = module.exports = app;
