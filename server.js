const express = require('express');
const app = express();
const path = require('path');
const _ = require('lodash');
const nbaService = require('./services/nba.service.js');
const ncaaService = require('./services/ncaa.service.js');

app.set('view engine', 'jade');

app.get('/', (req, res) => {
 res.render('index', {})
})

app.get('/ncaa/', (req, res) => {
 let team = req.params.ncaa;
 let url = 'http://espn.go.com/mens-college-basketball/teams';
 ncaaService.getNCAAIDs(url, (schoolData) => {
  res.render('includes/ncaa', {
   schoolData: schoolData
  })
 });
})

app.get('/:team', (req, res) => {
 let team = req.params.team;
 if (team == 'mavericks') {
  let url = 'http://www.mavs.com/team/team-stats/';
  nbaService.getMavsData(url, (jsonData) => {
   res.render('includes/mavs')
  })
 } else {
  let url = 'http://www.nba.com/' + team + '/stats';
  nbaService.getNBAData(url, (jsonData) => {
   res.render('includes/stats', {
    jsonData: jsonData,
    team: getTeamName(url)
   })
  });
 }
})

const getTeamName = (url) => {
  let newUrl = url.split('/');
  return newUrl[3].toUpperCase();
}

app.listen('3333')
console.log('Running on 3333');
exports = module.exports = app;
