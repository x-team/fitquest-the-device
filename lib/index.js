'use strict';

const BotKit = require('botkit');
const { slack, messages } = require('./config');
const endpoint = require('./endpoint');

const KEYWORD = /^[dD]one/;

const controller = BotKit.slackbot({ debug: false });

controller.spawn({ token: slack.botToken }).startRTM((err) => {
  if (err) throw err;
});

controller.on('ambient', (bot, message) => {
  const { text, user, ts } = message;

  if (text.match(KEYWORD)) {
    const formattedTs = ts.replace('.', '');

    endpoint.submitRequest(user, formattedTs, (err, res, body) => {
      const whisperMessage = err ? messages.failure : messages.success;
      bot.whisper(message, whisperMessage);
    });
  }

  console.log('Message received', JSON.stringify({ message }, null, 2));
});
