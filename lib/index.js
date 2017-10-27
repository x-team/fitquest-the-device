'use strict';

const BotKit = require('botkit');
const config = require('./config');

const controller = BotKit.slackbot({ debug: true });

controller.spawn({ token: config.slack.botToken }).startRTM((err) => {
  if (err) throw err;
});

controller.on('ambient', (bot, message) => {
  console.log('Message received', JSON.stringify({ message }, null, 2));
});
