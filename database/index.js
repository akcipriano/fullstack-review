const mongoose = require('mongoose');
// require('dotenv').config();
mongoose.connect(process.env.MONGOLAB_JADE_URI, {
  useMongoClient: true
});

let repoSchema = mongoose.Schema({
  // TODO: your schema here!
  repo_id: {type: String, unique: true},
  username: String,
  repo_name: String,
  html_url: String,
  created_at: Date,
  stargazer_count: Number,
});

let Repo = mongoose.model('Repo', repoSchema);
Repo.on('index', function(err){
  if (err) console.log(err);
});

let save = (body) => {
  console.log('SAVE BODY..........', typeof body);
  body.forEach(singleRepo => {
    let sample = new Repo({
      repo_id: singleRepo.id,
      username: singleRepo.owner.login,
      repo_name: singleRepo.name,
      html_url: singleRepo.html_url,
      created_at: singleRepo.created_at,
      stargazer_count: singleRepo.stargazers_count,
    });
    sample.save(function(err, sample) {
      if (err) console.log(err);
    });
  });
}

module.exports.save = save;