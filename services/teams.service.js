require('es6-promise').polyfill();
require('isomorphic-fetch');

export function getTeamList(url) {
    return fetch(url)
        .then(function (response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
}
