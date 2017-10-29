const { channelWhitelist } = require('./config');

exports.isFromValidChannel = (message) => message.channel && channelWhitelist.includes(message.channel);

exports.parseMessage = (message) => {
  const ts = message.message_ts || message.ts;

  return {
    userId: message.user,
    ts: ts.replace('.', ''),
  };
};
