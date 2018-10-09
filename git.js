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
  const remotes = (await repository.getReferenceNames(1)).filter(f => {
    return f.startsWith('refs/remotes/');
  });
  await repository.fetchAll();
  // await repository.mergeBranches('master', 'origin/master');
  const commits = {};
  for(const remote of remotes) {
    const remoteName = remote.split('refs/remotes/')[1];
    const localName = remoteName.split('origin/')[1];
    // console.log(localName, remoteName);
    // await repository.mergeBranches(localName, remoteName);
    const commit = await repository.getBranchCommit(remoteName);
    console.log(localName, commit.sha());
    commits[localName] = commit;
  };
  // const commit = await repository.getBranchCommit('master');
  // // const diffs = await commit.getDiff();
  // // diffs.forEach(diff => {
  // //   const delta = diff.getDelta(0);
  // //   console.log(delta.nfiles());
  // // });
  // return commit;
  return commits;
};

const compareCommit = async commits => {
  for(const branch in commits) {
    const commit = commits[branch];
    const isNewCommit = await redis.setCommitShaAndCompare(branch, commit.sha());
    if(isNewCommit) {
      await telegram.sendCommitMessage(branch, commit);
    }
  }
};

const init = async () => {
  await cloneIfNotExists();
  const commit = await getNewCommits();
  await compareCommit(commit);
};

exports.init = init;