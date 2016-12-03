const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const app = express();
const path = require('path');

app.set('view engine', 'jade');

const getNBAData = (url, callback) => {
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
     reb = $('.reb', this).text(),
     ast = $('.ast', this).text();
     reb = $('.reb', this).text();
     stl = $('.stl', this).text();
    let data = {
     player: player,
     num: num,
     pos: pos,
     pts: pts,
     ast: ast,
     reb: reb,
     stl: stl,
    };
    self.json.push(data);
   });
  }
  return callback(self.json)
 })
}


const getMavsData = (url, callback) => {
	let self = this;
	request(url, (error, response, html) => {
		if(!error){
			self.json = [];
      self.json.push("The mavs are terrible. They have their own separate website so stats are not available.")
		}
		return callback(self.json)
	})
}

const getNCAAIDs = (url, callback) => {
 let self = this;
 request(url, (error, response, html) => {
  if (!error) {
   let $ = cheerio.load(html);
   self.json = [];
   $('.medium-logos h5').each(function(index, value) {
    let link = $('a', this).attr('href');
    let spl = link.split('_');
    let id = spl[1];
    let splt = id.split('/')
    let teamName = splt[3];
    let data = {
     teamName: teamName,
     link: link
    };
    self.json.push(data);
   });
  }
  return callback(self.json)
 })
}

app.get('/', (req, res) => {
 res.render('index', {
  title: 'Welcome'
 })
})

app.get('/ncaa/', (req, res) => {
 let team = req.params.ncaa;
 let url = 'http://espn.go.com/mens-college-basketball/teams';
 getNCAAIDs(url, (schoolData) => {
  res.render('index', {
   schoolData: schoolData
  })
 });
})

app.get('/:team', (req, res) => {
 let team = req.params.team;
 if (team == 'mavericks') {
  let url = 'http://www.mavs.com/team/team-stats/';
  getMavsData(url, (jsonData) => {
   res.render('index', {
    jsonData: jsonData
   })
  })
 } else {
  let url = 'http://www.nba.com/' + team + '/stats';
  getNBAData(url, (jsonData) => {
   res.render('index', {
    jsonData: jsonData
   })
  });
 }
})

app.listen('3333')
console.log('Running on 3333');
exports = module.exports = app;
