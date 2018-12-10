const request = require('request');
var Promise = require('promise');
const cheerio = require('cheerio');

export function getNCAAIDs(url) {
  return new Promise((resolve) => {
    let json = [];

    request(url, (error, response, html) => {
      if (!error) {
        let $ = cheerio.load(html);
        $('.TeamLinks').each(function () {
          let link = $('a', this).attr('href');
          let spl = link.split('_');
          let id = spl[1];
          let splt = id.split('/');
          let teamName = splt[3];
          let data = {
            teamName: teamName,
            link: link
          };

          json.push(data);
        });
      }
      resolve(json);
    });
  });
}
