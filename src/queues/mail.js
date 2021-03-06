const config = require("config");
const redisURL =
  process.env.HEROKU_REDIS_CHARCOAL_URL || config.get("redisURL");
let siteURL = config.get("host");
let port = config.get("port");
const AWS = require("aws-sdk");
// const runMailQuest

// Append port if I the app is running on localhost
if (port === "localhost") {
  siteURL = `${siteURL}:${port}`;
}

const Bull = require("bull");
const queue = new Bull("mail", redisURL);

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_SES_API_VERSION = process.env.AWS_SES_API_VERSION;
const AWS_SES_REGION = process.env.AWS_SES_REGION;

let ses = new AWS.SES({
  // eslint-disable-line
  apiVersion: AWS_SES_API_VERSION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_SES_REGION
});

const replyToAddress = process.env.REPLY_TO_ADDRESS || process.env.FROM_EMAIL;
let sourceAddress = process.env.REPLY_TO_ADDRESS || process.env.FROM_EMAIL;

const sendQueuedEmail = (template, data, done) => {
  // quickly call done if the env for ENABLE_MAIL_QUEUES is falsy
  if (!process.env.ENABLE_EMAIL_QUEUES) {
    // done();
    // return;
  }
  // Continue if truthy
  let __data = data;
  __data.siteURL = siteURL;
  // Params for SES
  let params = {
    Destination: {
      ToAddresses: [data.email]
    },
    Source: sourceAddress,
    Template: template,
    TemplateData: JSON.stringify(__data),
    ReplyToAddresses: [replyToAddress]
  };
  // eslint-disable-next-line
  ses.sendTemplatedEmail(params, (err, data) => {
    if (err) {
      console.error(err); // eslint-disable-line
      // calls done incase there is an error, so we don't stay in a loop
      return done(err);
    }
    // Success? Call done and we are good to go
    done();
  });
};

queue.process("sendConfirmEmail", 2, (job, done) => {
  let username = job.data.username; // user registration email
  let email = job.data.email; // registration email
  let token = job.data.key; // Key for registration
  let data = { username, email, token };
  sendQueuedEmail("Confirm", data, done);
});

queue.process("resendConfirmEmail", 2, (job, done) => {
  let username = job.data.username; // user registration email
  let email = job.data.email; // registration email
  let token = job.data.key; // Key for registration
  let data = { username, email, token };
  sendQueuedEmail("ResendConfirm", data, done);
});

queue.process("sendForgotPasswordEMail", 2, (job, done) => {
  let username = job.data.username; // user registration email
  let email = job.data.email; // registration email
  let token = job.data.key; // Key for registration
  let data = { username, email, token };
  sendQueuedEmail("ForgotPassword", data, done);
});

module.exports = queue;
