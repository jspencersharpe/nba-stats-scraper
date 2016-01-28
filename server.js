var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var path = require('path');

app.set('view engine', 'jade');

function getNBAData(url, callback) {
	var self = this;
	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			self.json = [];
			$('.stats-table.season-averages tr').each(function(index, value){
					var player = $('.playerName', this).text(), num = $('.playerNumber', this).text(),
					pos = $('.playerPosition', this).text(), pts = $('.pts', this).text(),
					reb = $('.reb', this).text(), ast = $('.ast', this).text();
					reb = $('.reb', this).text(); stl = $('.stl', this).text();
					var data = {
						player: player, num: num, pos: pos, pts: pts, ast: ast, reb: reb, stl: stl,
					};
					self.json.push(data);
			});
		}
		return callback(self.json)
	})
}
function getMavsData(url, callback) {
	var self = this;
	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			self.json = [];
			$('.player-stats-table').first().find('tr').each(function(index, value){
				var player = $('th', this).first().text();
				var pts = $('td', this).last().text(),
				ast = $('td:nth-child(9)', this).text(),
				reb = $('td:nth-child(8)', this).text(),
				stl = $('td:nth-child(10)', this).text()

					var data = {
						player: player,
						pts: pts,
						ast: ast,
						reb: reb,
						stl: stl
					};
					self.json.push(data);
			});
		}
		return callback(self.json)
	})
}
function getNCAAIDs(url, callback) {
	var self = this;
	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			self.json = [];
			$('.medium-logos h5').each(function(index, value){
					var link = $('a', this).attr('href');
					var data = {
						link : link
					};
					self.json.push(data);
			});
		}
		return callback(self.json)
	})
}

app.get('/', function(req, res){
	res.render('index', {title: 'Welcome'})
})

app.get('/:ncaa', function(req, res){
	var team = req.params.ncaa;
	var url = 'http://espn.go.com/mens-college-basketball/teams';
	getNCAAIDs(url, function(jsonData) {
		res.render('index', {jsonData: jsonData})
	});
})

app.get('/:team', function(req, res) {
	var team = req.params.team;
	if (team == 'mavericks') {
		var url = 'http://www.mavs.com/team/team-stats/';
		getMavsData(url, function(jsonData) {
			res.render('index', {jsonData: jsonData})
		})
	} else {
		var url = 'http://www.nba.com/'+ team +'/stats';
		getNBAData(url, function(jsonData) {
			res.render('index', {jsonData: jsonData})
		});
	}
})

app.listen('3333')
console.log('Running on 3333');
exports = module.exports = app;
