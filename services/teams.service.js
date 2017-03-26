const request = require('request');
const cheerio = require('cheerio');

var exports = module.exports = {};

exports.getTeamList = (url, callback) => {
  let self = this;
  request(url, (error, response, html) => {
    if (!error) {
      let $ = cheerio.load(html);
      self.teamInfo = [];

      $('.team__list_wrapper').each(function(index, value) {
        let arr = $('.team__list img', this);
        arr.each(function(index, value) {
          let team = {
            url: value.attribs.src,
            name: value.attribs.alt
          };
          self.teamInfo.push(team);
        });
      });

      return callback(self.teamInfo);
    }
  });
}
