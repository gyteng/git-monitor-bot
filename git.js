const Git = require('nodegit');
const config = require('./config');
const fs = require('fs');

const cloneIfNotExists = async () => {
  try {
    fs.statSync(`./repository/${ config.repositoryName }`);
  } catch (err) {
    await Git.Clone(config.repositoryUrl, `./repository/${ config.repositoryName }`);
  }
};

const getNewCommits = async () => {
  const repository = await Git.Repository.open(`./repository/${ config.repositoryName }`);
  await repository.fetchAll();
};

(async () => {
  await cloneIfNotExists();
  await getNewCommits();
})();
