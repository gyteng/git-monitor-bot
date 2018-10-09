const Git = require('nodegit');
const config = require('./config');
const fs = require('fs');
const redis = require('./redis')
const telegram = require('./telegram');

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
  await repository.mergeBranches('master', 'origin/master');
  const commit = await repository.getBranchCommit('master');
  console.log(commit.message());
  console.log(commit.sha());
  const isNewCommit = await redis.setCommitShaAndCompare(commit.sha());
  if(isNewCommit) {
    await telegram.sendMessage(commit.message() + commit.sha());
  }
};

const init = async () => {
  await cloneIfNotExists();
  await getNewCommits();
};

// init();

exports.init = init;