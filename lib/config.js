const winston = require('winston');

const logger = new winston.Logger({
  level: 'debug',
  levels: winston.config.syslog.levels,
  transports: [
    new winston.transports.Console(),
  ],
});

const shouldSubmitCallbackId = 'should_submit_callback';
const shouldSubmitActions = {
  submit: {
    name: 'submit',
    text: 'Challenge completed',
    value: 'submit',
    type: 'button',
    style: 'primary',
  },
  reject: {
    name: 'reject',
    text: 'Ignore file',
    value: 'reject',
    type: 'button',
  },
};

module.exports = {
  logger,
  keywordRegex: /^[dD]one/,
  server: {
    port: process.env.PORT,
  },
  storeFile: './db_slackbot/',
  slack: {
    botToken: process.env.SLACK_BOT_TOKEN,
    clientId: process.env.SLACK_APP_CLIENT_ID,
    clientSecret: process.env.SLACK_APP_CLIENT_SECRET,
  },
  vault: {
    endpoint: process.env.VAULT_ENDPOINT_URL,
  },
  replies: {
    replyMessages: {
      shouldSubmitAttachment: {
        title: 'Should the guardians consider this file as a proof of challenge completion?',
        attachment_type: 'default',
        callback_id: shouldSubmitCallbackId,
        actions: [
          shouldSubmitActions.submit,
          shouldSubmitActions.reject,
        ],
      },
      requestSent: 'Your request has been sent to the HP Vault guardians.',
      requestFailed: 'Your request could not been sent to HP Vault, please consult with the guardians.',
      doNotSubmitAnswer: 'Not submitted!',
    },
    actions: {
      shouldSubmitActions,
      shouldSubmitCallbackId,
    },
  },
  channelWhitelist: process.env.SLACK_CHANNEL_WHITELIST.split(','),
};
