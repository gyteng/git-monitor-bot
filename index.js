const rp = require('request-promise');
const config = require('./config');
const url = `https://api.telegram.org/bot${ config.token }/`;

rp({
  uri: `${ url }getUpdates`,
  body: {},
  json: true,
}).then(success => {
  console.log(JSON.stringify(success, null, 4));
});