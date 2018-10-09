const rp = require('request-promise');
const config = require('./config');
const url = `https://api.telegram.org/bot${ config.token }/`;

const sendMessage = async message => {
  return rp({
    uri: `${ url }sendMessage`,
    body: {
      chat_id: config.group,
      text: message,
    },
    json: true,
  });
};

const sendCommitMessage = async commit => {
  let message = '';
  message += commit.author().name() + ' create a new commit at ' + new Date(commit.time() * 1000) + '\n';
  message += 'sha: ' + commit.sha() + '\n';
  message += 'msg: ' + commit.message() + '\n';
  return rp({
    uri: `${ url }sendMessage`,
    body: {
      chat_id: config.group,
      text: message,
    },
    json: true,
  });
};

exports.sendMessage = sendMessage;
exports.sendCommitMessage = sendCommitMessage;