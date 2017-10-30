const BotKit = require('botkit');
const config = require('./config');
const { isFromValidChannel } = require('./helpers');
const vault = require('./vault');

const { logger, slack, server } = config;
const { replyMessages, actions } = config.replies;

const controller = BotKit.slackbot({
  debug: false,
  logger: logger,
  json_file_store: config.storeFile,
});

controller.configureSlackApp({
  clientId: slack.clientId,
  clientSecret: slack.clientSecret,
  scopes: ['bot'],
});

controller.setupWebserver(server.port, (err) => {
  if (err) throw err;

  controller
    .createHomepageEndpoint(controller.webserver)
    .createOauthEndpoints(controller.webserver, () => {})
    .createWebhookEndpoints(controller.webserver);
});

controller.spawn({ token: slack.botToken }).startRTM((err) => {
  if (err) throw err;
});

controller.on('ambient', (bot, message) => {
  const { text } = message;
  const shouldReact = isFromValidChannel && text.match(config.keywordRegex);

  if (!shouldReact) {
    return;
  }

  vault.submitRequest(message, (err) => {
    const replyMessage = err ? replyMessages.requestFailed : replyMessages.requestSent;
    bot.whisper(message, replyMessage);
  });
});

controller.on('file_share', ((bot, message) => {
  const { file } = message;
  const shouldReact = isFromValidChannel(message) && file.mimetype.includes('image');

  if (!shouldReact) {
    return;
  }

  bot.whisper(message, { attachments: [replyMessages.shouldSubmitAttachment] });

  controller.storage.teams.save({ id: message.team });
}));

controller.on('interactive_message_callback', (bot, message) => {
  const { callback_id: callbackId } = message;

  const shouldReact = isFromValidChannel(message) && callbackId === actions.shouldSubmitCallbackId;
  if (!shouldReact) {
    return;
  }

  const [performedAction] = message.actions;
  const submitRequest = performedAction.value === actions.shouldSubmitActions.submit.value;
  if (!submitRequest) {
    bot.replyInteractive(message, {
      attachments: [{
        ...replyMessages.shouldSubmitAttachment,
        text: replyMessages.doNotSubmitAnswer,
        actions: [],
      }],
    });

    return;
  }

  vault.submitRequest(message, (err) => bot.replyInteractive(message, {
    attachments: [{
      ...replyMessages.shouldSubmitAttachment,
      text: err ? replyMessages.requestFailed : replyMessages.requestSent,
      actions: [],
    }],
  }));
});
