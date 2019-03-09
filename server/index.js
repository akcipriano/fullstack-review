const express = require('express');
const bodyParser = require('body-parser');
const getData = require('../helpers/github.js');
const insertToMongo = require('../database/index.js');
let app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/../client/dist'));

app.post('/repos', function (req, res) {
  // TODO - your code here!
  // This route should take the github username provided
  // and get the repo information from the github API, then
  // save the repo information in the database
  var username = req.body.username;
  getData.getReposByUsername(username, (err, res, body) => {
    if (err) throw err;
    if(!err && res.statusCode === 200) {
      var data = JSON.parse(body);

      console.log('REPO ID--------------------------------------->', data[0].id);
      console.log('NAME------------------------------------------>', data[0].name);
      console.log('USERNAME ------------------------------------->', data[0].owner.login);
      console.log('URL------------------------------------------->', data[0].html_url);
      console.log('CREATED AT------------------------------------>', data[0].created_at);
      console.log('STARGAZERS------------------------------------>', data[0].stargazers_count);

      insertToMongo.save(data);
    }
  });

  res.status(200).send('Server post success');
});

app.get('/repos', function (req, res) {
  // TODO - your code here!
  // This route should send back the top 25 repos
});

let port = 1128;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

