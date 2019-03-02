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

        $('tbody', '#per_game').each(function (item, index) {
          console.log(this)
          console.log('HI')
          console.log($('tr:first-child', this).text());
        })

        // $('#all_per_game').each(function (index, item) {
        //   console.log(index);


        // });

        const teamData = {};

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
