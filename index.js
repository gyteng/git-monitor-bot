const git = require('./git');

const later = require('later');
const text = 'every 1 min';
const schedule = later.parse.text(text);
later.setInterval(() => {
  git.init();
}, schedule);
git.init();