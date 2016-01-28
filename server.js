var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

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

app.get('/', function(req, res){
	res.render('index', {title: 'Welcome'})
})

app.get('/:team', function(req, res) {
	var team = req.params.team;
	var url = 'http://www.nba.com/'+ team +'/stats';
	getNBAData(url, function(jsonData) {
		res.render('main', {jsonData: jsonData})
	});
})

app.listen('3333')
console.log('Running on 3333');
exports = module.exports = app;
