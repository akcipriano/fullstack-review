const express = require('express');
const bodyParser = require('body-parser');
const getData = require('../helpers/github.js');
const insertToMongo = require('../database/index.js');
var MongoClient = require('mongodb').MongoClient;
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
var bigToSmall = (array) => {
  for (var i = 0; i < array.length - 1; i++) {
    // console.log('bigtosmall', array[i].stars)
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
  MongoClient.connect('mongodb://localhost:27017/fetcher', {useNewUrlParser: true}, function(err, client) {
    if (err) throw err;

    var db = client.db('fetcher');
    db.collection('repos').find().toArray(function(err, result) {
      if (err) throw err;

      //this creates an object with a key-value pair for star count and url which is stored in an array
      var objResults = [];
      result.forEach(rep => {
        var obj = {};
        obj['stars'] = rep.stargazer_count;
        obj['url'] = rep.html_url;
        objResults.push(obj);
      });
      //this orders the array with objects from most stars to least stars
      var ex = bigToSmall(objResults);
      //stores the top 25 repos (highest stars)
      var topTwentyFive = [];
      for (var i = 0; i < 25; i++) {
        if (ex[i]) {
          topTwentyFive.push(ex[i]);
        }
      }
      console.log('big2small', ex);
      console.log('DB RESULTS', objResults);
      res.status(200).send(topTwentyFive);
    });
  });
});


let port = 1128;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});