const request = require('request');
const { vault } = require('./config');

module.exports = {
  submitRequest: (userId, ts, callback) => {
    const requestData = JSON.stringify({ userId, ts }, null, 2);
    const options = {
      url: vault.endpoint,
      method: 'POST',
      body: requestData,
      headers: {
        'content-type': 'application/json',
      },
    };

    request(options, callback);
  },
};
