require('es6-promise').polyfill();
require('isomorphic-fetch');

const mockBrowserHeaders = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'en-US,en;q=0.8',
  'Connection': 'keep-alive',
  'Host': 'stats.nba.com',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
};

export default function getNBAData(url) {
  return fetch(url, {
    method: 'GET',
    headers: mockBrowserHeaders
  }).then(function (response) {
    if (response.status >= 400) {
      console.log(response);
      throw new Error("Bad response from server");
    }
    return response.json();
  });
}

