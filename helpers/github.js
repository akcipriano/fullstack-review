const request = require('request');
const config = require('../config.js');
const save = require('../database/index.js');

let getReposByUsername = (username) => {
  // TODO - Use the request module to request repos for a specific
  // user from the github API

  // The options object has been provided to help you out,
  // but you'll have to fill in the URL
  let options = {
    url: `https://api.github.com/users/${username}/repos`,
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${config.TOKEN}`
    }
  };

  function callback (error, response, body) {
    if(!error && response.statusCode === 200) {
      var data = JSON.parse(body);
      // console.log('WHOLE DATA:', data);
      console.log('REPO ID--------------------------------------->', data[0].id);
      console.log('NAME------------------------------------------>', data[0].name);
      console.log('USERNAME ------------------------------------->', data[0].owner.login);
      console.log('URL------------------------------------------->', data[0].html_url);
      console.log('CREATED AT------------------------------------>', data[0].created_at);
      console.log('STARGAZERS------------------------------------>', data[0].stargazers_count);

      save.save(data);
    }
  }
  request(options, callback);
}

module.exports.getReposByUsername = getReposByUsername;