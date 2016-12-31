const request = require('request');
const cheerio = require('cheerio');

var exports = module.exports = {};

exports.getNBAData = (url, callback) => {
 let self = this;
 request(url, (error, response, html) => {
  if (!error) {
   let $ = cheerio.load(html);
   self.json = [];
   $('.stats-table.season-averages tr').each(function(index, value) {
    let player = $('.playerName', this).text(),
     num = $('.playerNumber', this).text(),
     pos = $('.playerPosition', this).text(),
     pts = $('.pts', this).text(),
     fg_pct = $('.fg_pct', this).text();
     fg3_pct = $('.fg3_pct', this).text();
     reb = $('.reb', this).text(),
     ast = $('.ast', this).text();
     reb = $('.reb', this).text();
     stl = $('.stl', this).text();
     tov = $('.tov', this).text();
     pf = $('.pf', this).text();
    let data = {
     player: player,
     num: num,
     pos: pos,
     pts: pts,
     fg_pct: fg_pct,
     fg3_pct: fg3_pct,
     ast: ast,
     reb: reb,
     stl: stl,
     tov: tov,
     pf: pf
    };
    self.json.push(data);
   });
  }
  return callback(self.json)
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
