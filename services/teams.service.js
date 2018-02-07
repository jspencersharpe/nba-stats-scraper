const request = require('request');
var Promise = require('promise');
const cheerio = require('cheerio');

var exports = module.exports = {};

exports.getTeamList = (url) => {
  return new Promise((resolve) => {
    let self = this;
    request(url, (error, response, html) => {
      if (!error) {
        let $ = cheerio.load(html);
        self.teamInfo = [];

        $('.team__list_wrapper').each(function() {
          let arr = $('.team__list img', this);
          arr.each(function(index, value) {
            let team = {
              url: value.attribs.src,
              name: value.attribs.alt
            };
            self.teamInfo.push(team);
          });
        });
        resolve(self.teamInfo);
      }
    });
  })

}
