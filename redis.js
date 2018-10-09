const config = require('./config');
const Redis = require('ioredis');
const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  db: config.redis.db,
});

const setCommitShaAndCompare = async (branch, sha) => {
  const commit = await redis.get('commit:' + branch);
  if(!commit) {
    await redis.set('commit:' + branch, sha);
    return true;
  } else if (sha === commit) {
    return false;
  } else {
    await redis.set('commit:' + branch, sha);
    return true;
  }
};

exports.setCommitShaAndCompare = setCommitShaAndCompare;