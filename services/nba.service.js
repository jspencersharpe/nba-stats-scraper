const request = require('request');
const cheerio = require('cheerio');

var exports = module.exports = {};

exports.getNBAData = (url, callback) => {
 let self = this;
 request(url, (error, response, html) => {
  if (!error) {
   let $ = cheerio.load(html);
   self.playerInfo = [];
   self.teamInfo = [];
   $('#logo').each(function(index, value) {
     let img = $('img');
     let teamLogo = img[0].attribs.src;
     self.teamInfo = {
       teamLogo: teamLogo
     };
   });
   $('.stats-table.season-averages tr').each(function(index, value) {
    let player = $('.playerName', this).text(),
     num = $('.playerNumber', this).text(),
     pos = $('.playerPosition', this).text(),
     gp = $('.gp', this).text(),
     pts = $('.pts', this).text(),
     fg_pct = $('.fg_pct', this).text(),
     fg3_pct = $('.fg3_pct', this).text(),
     ft_pct = $('.ft_pct', this).text(),
     oreb = $('.oreb', this).text(),
     dreb = $('.dreb', this).text(),
     ast = $('.ast', this).text(),
     reb = $('.reb', this).text(),
     stl = $('.stl', this).text(),
     tov = $('.tov', this).text(),
     pf = $('.pf', this).text();
    let data = {
      player: player,
      gp: gp,
      num: num,
      pos: pos,
      pts: pts,
      fg_pct: fg_pct,
      fg3_pct: fg3_pct,
      ft_pct: ft_pct,
      ast: ast,
      reb: reb,
      oreb: oreb,
      dreb: dreb,
      stl: stl,
      tov: tov,
      pf: pf
    };
    self.playerInfo.push(data);
   });
   let teamData = {
     playerData: self.playerInfo,
     teamData: self.teamInfo
   }
   return callback(teamData);
  }
 })
}

exports.getMavsData = (url, callback) => {
  let self = this;
  request(url, (error, response, html) => {
  	if(!error){
  		self.json = [];
      self.json.push("The mavs are terrible. They have their own separate website so stats are not available.")
  	}
  	return callback(self.json)
  })
}
