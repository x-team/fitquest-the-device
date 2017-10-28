const BotKit = require('botkit');
const { slack, messages, logger, channelWhitelist } = require('./config');
const endpoint = require('./endpoint');

const KEYWORD = /^[dD]one/;

const controller = BotKit.slackbot({ logger });

controller.spawn({ token: slack.botToken }).startRTM((err) => {
  if (err) throw err;
});

controller.on('ambient', (bot, message) => {
  const { text, user, ts, channel } = message;
  const shouldReact = channelWhitelist.includes(channel) && text.match(KEYWORD);

  if (shouldReact) {
    const formattedTs = ts.replace('.', '');

    endpoint.submitRequest(user, formattedTs, (err) => { // , res, body) => {
      const whisperMessage = err ? messages.failure : messages.success;
      bot.whisper(message, whisperMessage);
    });
  }

  // logger.info('Message received', JSON.stringify({ message }, null, 2));
});
