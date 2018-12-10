const express = require('express');
const app = express();
const _ = require('lodash');
const nbaService = require('./services/nba.service');
const ncaaService = require('./services/ncaa.service');
const teamService = require('./services/teams.service');
const format = require('./helpers/format');

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  let url = 'https://www.nba.com/teams';
  teamService.getTeamList(url)
    .then(response => {
      let teamsList = format.formatTeamData(response);
      res.render('index', {
        teamsList: teamsList
      });
    }).catch(() => {
      res.render('404', {});
    });
});

app.get('/ncaa/', (req, res) => {
  let url = 'https://espn.go.com/mens-college-basketball/teams';
  ncaaService.getNCAAIDs(url)
    .then(response => {
      let orderedSchoolData = _.orderBy(response, ['teamName'], ['asc']);
      res.render('ncaa', {
        schoolData: format.formatSchoolList(orderedSchoolData)
      });
    }).catch(() => {
      res.render('404', {});
    });
});

app.get('/:team', (req, res) => {
  let team = req.params.team;
  let url = 'https://www.nba.com/' + team + '/stats';
  if (team === 'mavericks') {
    res.render('mavs');
  }

  nbaService.getNBAData(url)
    .then(response => {
      let playerData = format.formatStat(response.playerData);
      let teamData = response.teamData;
      res.render('stats', {
        playerData: playerData,
        team: format.formatTeamName(url),
        teamData: teamData
      });
    }).catch(() => {
      res.render('404', {});
    });
});

app.get('/player/:playerId', (req, res) => {
  let playerId = req.params.playerId;
  let url = 'https://www.nba.com/playerfile/' + playerId;

  nbaService.getPlayerData(url)
    .then(response => {
      let playerObj = response;
      playerObj.bio = _.compact(playerObj.bioList);
      playerObj.data = format.formatPlayerData(playerObj.rawInfo);
      delete playerObj.rawInfo;
      delete playerObj.bioList;
      res.render('player', {playerObj});
    }).catch(() => {
      res.render('404', {});
    });
});

app.listen(process.env.PORT || 3333);
console.log('Running on 3333');
exports = module.exports = app;
