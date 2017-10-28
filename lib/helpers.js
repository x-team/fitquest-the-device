const { channelWhitelist } = require('./config');

exports.withChannelFilter = (next) => (bot, message) => {
  const { channel } = message;

  if (channelWhitelist.includes(channel)) {
    next(bot, message);
  }
};
