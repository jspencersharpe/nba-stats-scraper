const request = require('request');
var Promise = require('promise');
const cheerio = require('cheerio');

export function getTeamList(url) {
  return new Promise((resolve) => {
    request(url, (error, response, html) => {
      if (!error) {
        let $ = cheerio.load(html);

        const teams = $('#all_teams_active .full_table th a');
        const teamArr = [];

        teams.each(function() {
          const split = this.attribs.href.split('/');
          const id = split[split.length - 2];

          const obj = {
            name: this.children[0].data,
            route: this.attribs.href,
            id: id
          };

          teamArr.push(obj);
        });

        resolve(teamArr);
      }
    });
  });
}
