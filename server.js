var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var team = process.argv[2];
// var team = team.toString();

app.get('/scrape', function(req, res){
	url = 'http://www.nba.com/'+ team +'/stats';

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var json = {};

			function createJSON(){
		    var self = this;
		    self.json = [];
		    $('.stats-table.season-averages tr').each(function(index, value){
		        var player = $('.playerName', this).text(),
						num = $('.playerNumber', this).text(),
						pos = $('.playerPosition', this).text(),
						pts = $('.pts', this).text(),
						reb = $('.reb', this).text(),
						ast = $('.ast', this).text();
						reb = $('.reb', this).text();
						stl = $('.stl', this).text();
		        var data = {
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
		    return self.json;
			}
		}

		fs.writeFile(team + '.json', JSON.stringify(createJSON(), null, 4), function(err){
        	console.log('JSON file written for ' + team);
        })
        res.send('No errors!')
	})
})

app.listen('3333')
console.log('Running on 3333');
exports = module.exports = app;
