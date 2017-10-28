
const winston = require('winston');

const logger = new winston.Logger({
  levels: winston.config.syslog.levels,
  transports: [
    new winston.transports.Console(),
  ],
});

module.exports = {
  logger,
  slack: {
    botToken: process.env.SLACK_BOT_TOKEN,
    clientId: process.env.SLACK_APP_CLIENT_ID,
    clientSecret: process.env.SLACK_APP_CLIENT_SECRET,
  },
  vault: {
    endpoint: process.env.VAULT_ENDPOINT_URL,
  },
  messages: {
    success: 'Your request has been sent to the HP Vault guardians.',
    failure: 'Your request could not been sent to HP Vault, please consult with the guardians.',
  },
};