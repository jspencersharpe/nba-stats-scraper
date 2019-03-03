import express from 'express';
import { formatStat, formatTeamData, formatPlayerData, formatPlayerStats } from './helpers/format';
import getNBAData from './services/nba.service';
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

app.get('/:name([\\w-]{0,}?):teamId(\\d+)/', (req, res) => {
  let { name, teamId} = req.params;
  name = name.replace(/-/g, "");
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
  const url = `https://stats.nba.com/stats/playercareerstats?PlayerID=${playerId}&PerMode=PerGame`;
  const infoUrl = `https://stats.nba.com/stats/commonplayerinfo?LeagueID=00&PlayerID=${playerId}`

    let playerStats = getNBAData(url).then(response => {
        const data = response.resultSets[0]
        return formatPlayerStats(data);
    });

    let playerInfo = getNBAData(infoUrl).then(response => {
        const data = response.resultSets[0];
        return formatPlayerData(data);
    });

    Promise.all([playerStats, playerInfo]).then(response => {
        const [ stats, playerInfo ] = response;

        res.render('player', {
            stats: stats,
            playerInfo: playerInfo
        });

    }).catch(() => {
      res.render('404', {});
    });
});

app.listen(process.env.PORT || 3333, () => console.log('Running on 3333'));

exports = module.exports = app;
