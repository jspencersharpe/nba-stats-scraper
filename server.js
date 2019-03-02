import express from 'express';
import _ from 'lodash';
import { formatStat, formatTeamData, formatPlayerData } from './helpers/format';
import { getNBAData, getPlayerData } from './services/nba.service';
const teamConfig = require('./teams_config.json');

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    const teamsList = formatTeamData(teamConfig);
    res.render('index', {
        teamsList: teamsList
    });
});

app.get('/:name/:teamId', (req, res) => {
  const { name, teamId} = req.params;
  const url = `https://stats.nba.com/stats/commonteamroster?LeagueID=00&Season=2018-19&TeamID=${teamId}`;
  const imgUrl = `https://www.nba.com/assets/logos/teams/primary/web/${name}.svg`

  getNBAData(url)
    .then(response => {
      let playerData = formatStat(response);
      const currentTeam = teamConfig.find(t => t.teamId === teamId);
      const teamData = Object.assign({}, currentTeam, {imgUrl: imgUrl});

      res.render('stats', {
        playerData: playerData,
        teamData: teamData
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
