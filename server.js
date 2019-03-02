import express from 'express';
import _ from 'lodash';
import { getTeamList } from './services/teams.service';
import { formatStat, formatTeamData, formatTeamName, formatPlayerData } from './helpers/format';
import { getNBAData, getPlayerData } from './services/nba.service';

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  let url = 'http://data.nba.net/10s/prod/v2/2018/teams.json';
  getTeamList(url)
    .then(response => {
      const teamsList = formatTeamData(response);
      res.render('index', {
        teamsList: teamsList
      });
    }).catch(() => {
      res.render('404', {});
    });
});

app.get('/:teamId', (req, res) => {
  const teamId = req.params.teamId;
  const url = `https://stats.nba.com/stats/commonteamroster?LeagueID=00&Season=2018-19&TeamID=${teamId}`;

  getNBAData(url)
    .then(response => {

      let playerData = formatStat(response);
      let teamData = response.teamData;

      console.log(playerData);
      res.render('stats', {
        playerData: playerData,
        // team: formatTeamName(url),
        // teamData: teamData
      });
    }).catch(() => {
      res.render('404', {});
    });
});

app.get('/player/:playerId', (req, res) => {
  let playerId = req.params.playerId;
  let url = 'https://www.nba.com/playerfile/' + playerId;

  getPlayerData(url)
    .then(response => {
      let playerObj = response;
      playerObj.bio = _.compact(playerObj.bioList);
      playerObj.data = formatPlayerData(playerObj.rawInfo);
      delete playerObj.rawInfo;
      delete playerObj.bioList;
      res.render('player', {playerObj});
    }).catch(() => {
      res.render('404', {});
    });
});

app.listen(process.env.PORT || 3333, () => console.log('Running on 3333'));

exports = module.exports = app;
