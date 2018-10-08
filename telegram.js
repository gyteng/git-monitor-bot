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

exports.sendMessage = sendMessage;