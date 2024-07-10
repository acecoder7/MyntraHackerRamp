const nodemailer = require('nodemailer');
// const { google } = require('googleapis');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
// const sgMail = require('@sendgrid/mail');

const oauth_link = 'https://developers.google.com/oauthplayground';


module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = user.first_name;
    this.url = url;
    this.from = process.env.EMAIL_ID;
  }


  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      { firstname: this.firstname, url: this.url, subject }
    );
    const mailOptions = {
      to: this.to,
      from: process.env.EMAIL_ID,
      subject: subject,
      text: htmlToText(html),
      html: html,
    };

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      secure: false,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.log(err);
    }
  }

  async sendVerificationEmail() {
    await this.send('VerificationEmail', 'Backbook email verification');
  }

  async sendPasswordReset() {
    await this.send(
      'PasswordReset',
      `${this.url} is your Backbook recovery code ( Valid for 10 min )`
    );
  }
};
