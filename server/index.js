const express = require('express');
const bodyParser = require('body-parser');
const getData = require('../helpers/github.js');
const insertToMongo = require('../database/index.js');
var MongoClient = require('mongodb').MongoClient;
let port = process.env.PORT;
let app = express();
require('dotenv').config();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/../client/dist'));

app.post('/repos', function (req, res) {
  // TODO - your code here!
  // This route should take the github username provided
  // and get the repo information from the github API, then
  // save the repo information in the database
  var username = req.body.username;
  getData.getReposByUsername(username, (error, response, body) => {
    if (error) throw error;
    if(!error && response.statusCode === 200) {
      var data = JSON.parse(body);
      insertToMongo.save(data);
      res.status(200).send('Server post success');
    }
  });
});

//helper function
var bigToSmall = (array) => {
  for (var i = 0; i < array.length - 1; i++) {
    var big = array[i];
    var small = array[i + 1];
    if(big.stars < small.stars) {
      array[i] = small
      array[i+1] = big;
      return bigToSmall(array);
    }
  }
  return array;
}

app.get('/repos', function (req, res) {
  // TODO - your code here!
  // This route should send back the top 25 repos
  MongoClient.connect(process.env.MONGODB_URI, {useNewUrlParser: true}, function(err, client) {
    if (err) throw err;
    var db = client.db(process.env.DB_NAME);
    db.collection('repos').find().toArray(function(err, result) {
      if (err) throw err;

      //this creates an object with a key-value pair for star count and url which is stored in an array
      var objResults = [];
      result.forEach(rep => {
        var obj = {};
        obj['stars'] = rep.stargazer_count;
        obj['user'] = rep.username;
        obj['name'] = rep.repo_name;
        obj['url'] = rep.html_url;
        objResults.push(obj);
      });
      //this orders the array with objects from most stars to least stars
      var popular = bigToSmall(objResults);
      //stores the top 25 repos (highest stars)
      var topTwentyFive = [];
      for (var i = 0; i < 25; i++) {
        if (popular[i]) {
          topTwentyFive.push(popular[i]);
        }
      }
      res.send(topTwentyFive);
    });
  });
});

if (port === null || port === '' || port === undefined) {
  port = 1128;
}

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

