const Nodemailder = require('nodemailer');
const { resolve } = require('path');
const Exphbs = require('express-handlebars');
const Nodemailerhbs = require('nodemailer-express-handlebars');

const MailConfig = require('../config/mail');

class Mail {
  constructor() {
    const { host, port, secure, auth } = MailConfig;

    this.transporter = Nodemailder.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transporter.use(
      'compile',
      Nodemailerhbs({
        viewEngine: Exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...MailConfig.default,
      ...message,
    });
  }
}

module.exports = new Mail();
