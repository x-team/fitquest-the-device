const request = require('request');
const { vault, logger } = require('./config');
const { parseMessage } = require('./helpers');

exports.submitRequest = (message, callback) => {
  const { userId, ts } = parseMessage(message);
  const requestData = JSON.stringify({ userId, ts }, null, 2);

  const options = {
    url: vault.endpoint,
    method: 'POST',
    body: requestData,
    headers: {
      'content-type': 'application/json',
    },
  };

  logger.info(`Submitting request (UserId: ${userId}, ts: ${ts})`);
  request(options, callback);
};
