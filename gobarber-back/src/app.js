require('dotenv/config');

const express = require('express');
const path = require('path');
const Sentry = require('@sentry/node');
const Youch = require('youch');
const HttpStatus = require('http-status-codes');

require('express-async-errors');

const routes = require('./app/routes/routes');
const sentryConfig = require('./config/sentry');

require('./database');

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errors);
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal server error' });
    });
  }
}

module.exports = new App().server;
