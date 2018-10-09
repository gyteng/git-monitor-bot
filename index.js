const git = require('./git');

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Caught exception:');
  console.error(err);
});

const later = require('later');
const text = 'every 1 min';
const schedule = later.parse.text(text);
later.setInterval(() => {
  git.init();
}, schedule);
git.init();