const BotKit = require('botkit');
const { slack, messages, logger } = require('./config');
const { withChannelFilter } = require('./helpers');
const endpoint = require('./endpoint');

const KEYWORD = /^[dD]one/;

const controller = BotKit.slackbot({ logger });

controller.spawn({ token: slack.botToken }).startRTM((err) => {
  if (err) throw err;
});

controller.on('ambient', withChannelFilter((bot, message) => {
  const { text, user, ts } = message;
  const shouldReact = text.match(KEYWORD);

  if (shouldReact) {
    const formattedTs = ts.replace('.', '');

    endpoint.submitRequest(user, formattedTs, (err) => { // , res, body) => {
      const whisperMessage = err ? messages.failure : messages.success;
      bot.whisper(message, whisperMessage);
    });
  }
}));

controller.on('file_shared', ((bot, message) => {
  // const { text, user, ts } = message;

  bot.whisper(message, {
    attachments: [
      {
        title: 'Do you want to submit this file as a completed challenge ?',
        callback_id: '123',
        attachment_type: 'default',
        actions: [
          {
            name: 'submit',
            text: 'Challenge completed',
            value: 'submit',
            type: 'button',
            style: 'primary',
          },
          {
            name: 'reject',
            text: 'Ignore file',
            value: 'reject',
            type: 'button',
            style: 'danger',
          },
        ],
      },
    ],
  });
}));
