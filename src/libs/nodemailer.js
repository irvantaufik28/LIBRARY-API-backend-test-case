require('dotenv').config();
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: process.env.MAILER_SMTP_HOST,
  port: process.env.MAILER_SMTP_PORT,
  secure: process.env.MAILER_SECURE === 'true',
  auth: {
    user: process.env.MAILER_AUTH_USER,
    pass: process.env.MAILER_AUTH_PASSWORD,
  },
});

module.exports = transport;
