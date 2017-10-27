'use strict';

const BotKit = require('botkit');
const config = require('./config');

const KEYWORD = /^[dD]one/;

const controller = BotKit.slackbot({ debug: true });

controller.configureSlackApp({
  clientId: config.slack.clientId,
  clientSecret: config.slack.clientSecret,
  redirectUri: 'https://localhost',
  scopes: ['bot']
});

controller.setupWebserver('8080', function(err, webserver) {
  controller
    .createHomepageEndpoint(controller.webserver)
    .createOauthEndpoints(controller.webserver, (err,req,res) => {})
    .createWebhookEndpoints(controller.webserver);
});

controller.spawn({ token: config.slack.botToken }).startRTM((err) => {
  if (err) throw err;
});

controller.on('ambient', (bot, message) => {
  const { text } = message;

  if (text.match(KEYWORD)) {
    bot.whisper(message, {
      attachments:[
        {
          title: 'A new request has been sent to the Vault, please verify.',
          callback_id: '123',
          attachment_type: 'default',
          actions: [
            {
              name: 'accept',
              text: 'Accept',
              value: 'accept',
              type: 'button',
              style: 'primary',
            },
            {
              name: 'reject',
              text: 'Reject',
              value: 'reject',
              type: 'button',
              style: 'danger',
            }
          ]
        }
      ]
    });
  }

  console.log('Message received', JSON.stringify({ message }, null, 2));
});