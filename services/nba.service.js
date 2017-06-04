const request = require('request');
var Promise = require("promise");
const cheerio = require('cheerio');

var exports = module.exports = {};

exports.getNBAData = (url) => {
  let self = this;
  return new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if (!error) {
        let $ = cheerio.load(html);
        self.playerInfo = [];
        self.teamInfo = [];
        self.imagesArr = [];
        self.idArr = [];
        $('#logo').each(function(index, value) {
          let img = $('img');
          let teamLogo = img[0].attribs.src;
          self.teamInfo = {
            teamLogo: teamLogo
          };
        });
        $('.stats-table.season-averages tr').each(function(index, value) {
          let playerLink = $('.playerName a');
          let playerImg = $('.player-name__inner-wrapper img');
          self.idArr.push(playerLink[index].attribs.href);
          self.imagesArr.push(playerImg[index].attribs.src);
          let data = {
            name: $('.playerName', this).text(),
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
          self.playerInfo.push(data);
        });
        self.imagesArr.unshift('');
        self.idArr.unshift('');
        let idArr = self.idArr.map((x) => {
          let splt = x.split('/');
          return splt[4];
        });
        self.playerInfo.forEach((value, index) => {
          value.pic = self.imagesArr[index];
          value.playerId = idArr[index];
          return value;
        });
        let teamData = {
          playerData: self.playerInfo,
          teamData: self.teamInfo
        }
        resolve(teamData);
      }
    });
  });
}

exports.getPlayerData = (url) => {
  return new Promise((resolve, reject) => {
    let self = this;
    request(url, (error, response, html) => {
      if (!error) {
        let $ = cheerio.load(html);
        let data = [];
        let playerObj = {};
        let seasonStats = null;
        let careerStats = null;
        let bioList = [];
        $('.nba-player-season-career-stats table tbody').each(function(index, value) {
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
        $('.nba-player-vitals').each(function(index, value) {
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
