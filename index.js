const rp = require('request-promise');
const config = require('./config');
const url = `https://api.telegram.org/bot${ config.token }/`;

// rp({
//   uri: `${ url }getUpdates`,
//   body: {},
//   json: true,
// }).then(success => {
//   console.log(JSON.stringify(success, null, 4));
// });

const Git = require('nodegit');

// Git.Clone(config.repositoryUrl, `./repository/${ config.repositoryName }`).then(function(repository) {
//   console.log(repository);
//   return repository.getBranchCommit('master');
// }).then(console.log);

const getLastCommit = async () => {
  const repository = await Git.Repository.open(`./repository/${ config.repositoryName }`);
  const commit = await repository.getBranchCommit('master');
  console.log(commit.message(), commit.author().email());
};

const later = require('later');
const text = 'every 1 min';
const schedule = later.parse.text(text);
later.setInterval(() => {
  // getLastCommit();
}, schedule);
getLastCommit();
// require('./telegram').sendMessage('BBB');