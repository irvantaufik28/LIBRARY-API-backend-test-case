const nodemailerTransport = require('../libs/nodemailer');
const emailMessage = require('../internal/constant/emailMessage');

class EmailRepository {
  constructor() { }

  async sendEmail(subject, recipient, text, html) {
    await nodemailerTransport.sendMail({
      from: `"${process.env.MAILER_SENDER_NAME}" <${process.env.MAILER_SENDER_EMAIL}>`,
      to: recipient,
      subject,
      text,
      html,
    });
  }

  async sendNotificationPenalty(email, data) {
    let content = emailMessage.PENALTYMEMBER;
    let text = content.text_value
      .replaceAll('{name}', data.name);

    let html = content.html_value
      .replaceAll('{name}', data.name);

    await this.sendEmail('Penalty', email, text, html);
  }
}

module.exports = EmailRepository;
