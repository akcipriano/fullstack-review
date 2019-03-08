const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');

let repoSchema = mongoose.Schema({
  // TODO: your schema here!
  username: String,
  repo_id: String,
  repo_name: String,
  html_url: String,
  created_at: Date,
  stargazer_count: Number,
});

let Repo = mongoose.model('Repo', repoSchema);

//when this and sample.save run, it creates a new document in the collection
// let sample = new Repo({
//   username: 'Example',
//   repo_id: 'String',
//   repo_name: 'String',
//   html_url: 'String',
//   created_at: '04-09-2015',
//   stargazer_count: 5,
// })

// sample.save(function(err, sample) {
//   if (err) console.log(err);
// })

let save = (/* TODO */) => {
  // TODO: Your code here
  // This function should save a repo or repos to
  // the MongoDB
}

module.exports.save = save;