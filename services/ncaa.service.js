const request = require('request');
var Promise = require("promise");
const cheerio = require('cheerio');

var exports = module.exports = {};

exports.getNCAAIDs = (url) => {
  let self = this;
  return new Promise((resolve, reject) => {
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
      resolve(self.json)
    });
  });
}
