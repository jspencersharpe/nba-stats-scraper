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
  teamService.getTeamList(url)
    .then(response => {
      let teamsList = format.formatTeamData(response);
      res.render('index', {
        teamsList: teamsList
      });
    }).catch(err => {
      res.render('404', {});
    });;
});

app.get('/ncaa/', (req, res) => {
  let team = req.params.ncaa;
  let url = 'http://espn.go.com/mens-college-basketball/teams';
  ncaaService.getNCAAIDs(url)
    .then(response => {
      let orderedSchoolData = orderBy(response, ['teamName'], ['asc']);
      res.render('includes/ncaa', {
        schoolData: format.formatSchoolList(orderedSchoolData)
      });
    }).catch(err => {
      res.render('404', {});
    });
});

app.get('/:team', (req, res) => {
  let team = req.params.team;
  let url = 'http://www.nba.com/' + team + '/stats';
  if (team == 'mavericks') {
    res.render('includes/mavs');
  }

  nbaService.getNBAData(url)
    .then(response => {
      let playerData = format.formatStat(response.playerData);
      let teamData = response.teamData;
      res.render('includes/stats', {
        playerData: playerData,
        team: format.formatTeamName(url),
        teamData: teamData
      })
    }).catch(err => {
      res.render('404', {});
    });
});

app.get('/player/:playerId', (req, res) => {
  let playerId = req.params.playerId;
  let url = 'http://www.nba.com/playerfile/' + playerId;

  nbaService.getPlayerData(url)
    .then(response => {
      let playerObj = response;
      playerObj.data = format.formatPlayerData(playerObj.rawInfo);
      delete playerObj.rawInfo;
      res.render('includes/player', {playerObj});
    }).catch(err => {
      res.render('404', {});
    });
});

app.listen(process.env.PORT || 3333)
console.log('Running on 3333');
exports = module.exports = app;
