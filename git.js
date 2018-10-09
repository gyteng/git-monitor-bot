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
  // const diffs = await commit.getDiff();
  // diffs.forEach(diff => {
  //   const delta = diff.getDelta(0);
  //   console.log(delta.nfiles());
  // });
  return commit;
  
};

const compareCommit = async commit => {
  const isNewCommit = await redis.setCommitShaAndCompare(commit.sha());
  if(isNewCommit) {
    await telegram.sendCommitMessage(commit);
  }
};

const init = async () => {
  await cloneIfNotExists();
  const commit = await getNewCommits();
  await compareCommit(commit);
};

exports.init = init;