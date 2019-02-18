const request = require('request');
var Promise = require('promise');
const cheerio = require('cheerio');

export function getStatsData(url) {
  return new Promise((resolve) => {
    request(url, (error, response, html) => {
      if (!error) {
        let $ = cheerio.load(html);
        let playerInfo = [];
        let teamInfo = [];
        let idArr = [];

        const teamLogo = $('.teamlogo')[0].attribs.src;

        teamInfo = {
          teamLogo: teamLogo
        };

        $('#all_per_game .stats_table tbody tr').each(function (index, item) {
          console.log(index);


          console.log($('[data-stat="player"]', this).text());

          $('td', item).each(function (idx, itm) {
            console.log('hello');
            // console.log(itm.attribs['data-stat']);
            console.log($('[data-stat="player"]', itm).text());

            let data = {
              name: $('[data-stat="player"]').text(),
              gp: $('.gp', this).text(),
              num: $('.playerNumber', this).text(),
              pos: $('.playerPosition', this).text(),
              pts: $('.pts', this).text(),
              fg_pct: $('.fg_pct', this).text(),
              fg3_pct: $('.fg3_pct', this).text(),
              ft_pct: $('.ft_pct', this).text(),
              ast: $('.ast', this).text(),
              reb: $('.reb', this).text(),
              oreb: $('.oreb', this).text(),
              dreb: $('.dreb', this).text(),
              stl: $('.stl', this).text(),
              tov: $('.tov', this).text(),
              pf: $('.pf', this).text()
            };

            playerInfo.push(data);
          });
        });
        idArr.unshift('');
        let newIdAr = idArr.map((x) => {
          let splt = x.split('/');
          return splt[4];
        });

        playerInfo.forEach((value, index) => {
          value.playerId = newIdAr[index];
          return value;
        });

        let teamData = {
          playerData: playerInfo,
          teamData: teamInfo
        };

        resolve(teamData);
      }
    });
  });
}

export function getPlayerData(url) {
  return new Promise((resolve) => {
    request(url, (error, response, html) => {
      if (!error) {
        let $ = cheerio.load(html);
        let data = [];
        let playerObj = {};
        let seasonStats = null;
        let careerStats = null;
        let bioList = [];
        $('.nba-player-season-career-stats table tbody').each(function() {
          let season = $('tr:first-child', this).text();
          let career = $('tr:nth-child(2)', this).text();
          let seasSplt = season.split(' ');
          let carSplt = career.split(' ');
          let filteredSeason = seasSplt.filter(i => i !== '' && i !== '\n');
          let filteredCareer = carSplt.filter(i => i !== '' && i !== '\n');
          if (!seasonStats) {
            playerObj = [];
          }
          seasonStats = filteredSeason.map(i => {
            return i.split('\n')[0];
          });
          careerStats = filteredCareer.map(i => {
            return i.split('\n')[0];
          });
        });
        $('.nba-player-detail__bio p br').each(function(index, value) {
          let val = value.next;
          if (val) {
            bioList.push(val.data);
          }
        });
        playerObj.bioList = bioList;
        $('.nba-player-header__headshot img').each(function(index, value) {
          playerObj.name = value.attribs.alt;
          playerObj.img = value.attribs.src;
        });
        $('.nba-player-vitals').each(function() {
          let res = $('span', this).text();
          data.push(res);
        });
        if (seasonStats) {
          playerObj.seasonStats = {
            mpg: seasonStats[1],
            fg: seasonStats[2],
            tp: seasonStats[3],
            ft: seasonStats[4],
            ppg: seasonStats[5],
            rpg: seasonStats[6],
            apg: seasonStats[7],
            bpg: seasonStats[8]
          };
        }
        if (careerStats) {
          playerObj.careerStats = {
            mpg: careerStats[2],
            fg: careerStats[3],
            tp: careerStats[4],
            ft: careerStats[5],
            ppg: careerStats[6],
            rpg: careerStats[7],
            apg: careerStats[8],
            bpg: careerStats[9]
          };
        }
        if (data.length > 0) {
          let rawInfo = data[0].split('\n');
          playerObj.rawInfo = rawInfo;
        }
        resolve(playerObj);
      }
    });
  });
}
