const Redis = require('ioredis');
const redis = new Redis();

const setCommitShaAndCompare = async sha => {
  const commit = await redis.get('commit');
  if(!commit) {
    await redis.set('commit', sha);
    return true;
  } else if (sha === commit) {
    return false;
  } else {
    await redis.set('commit', sha);
    return true;
  }
};

exports.setCommitShaAndCompare = setCommitShaAndCompare;