const request = require('request');
var Promise = require('promise');
const cheerio = require('cheerio');

export function getTeamList(url) {
  return new Promise((resolve) => {
    request(url, (error, response, html) => {
      if (!error) {
        let $ = cheerio.load(html);
        let teamInfo = [];

        $('.team__list_wrapper').each(function() {
          let arr = $('.team__list img', this);
          arr.each(function(index, value) {
            let team = {
              url: value.attribs.src,
              name: value.attribs.alt
            };
            teamInfo.push(team);
          });
        });
        resolve(teamInfo);
      }
    });
  });
}
