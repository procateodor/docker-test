'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const HttpStatus = require('http-status-codes');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet')

const path = require('path');
const rfs = require('rotating-file-stream');

const winston = require('winston');
require('winston-daily-rotate-file');

const {
  setLogger,
  setConfig,
  setDatabase,
  requireAuth,
} = require('./middlewares');
const models = require('./models');
const router = require('./routes');

const transportFile = new winston.transports.DailyRotateFile({
  filename: path.join(
    __dirname,
    'logs',
    'application',
    'application-%DATE%.log'
  ),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '50m',
  maxFiles: '14d',
});

const logger = winston.createLogger({
  transports: [new winston.transports.Console(), transportFile],
});

// create a rotating write streamxw
const logStream = rfs('access_logs.log', {
  interval: '1d',
  path: path.join(__dirname, 'logs', 'access')
});

const PORT = process.env.NODE_ENV === 'prod' ? 80 : 3000;
const config = dotenv.config({
  path: path.join(__dirname, 'vars', `${process.env.NODE_ENV}.env`),
}).parsed;

const app = express();

mongoose
  .connect(config.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('Connected to database');
  });

// Middlewares
app.use(cors());
app.use(helmet())
app.use(bodyParser.json());
app.use(compression());
app.use(morgan('tiny', { stream: logStream }));
app.use(setLogger(logger));
app.use(setConfig(config));
app.use(setDatabase(models));
app.use(requireAuth())
app.use('/', router);

// 404
app.use((req, res, next) => {
  return res
    .status(HttpStatus.NOT_FOUND)
    .send({ message: `Route ${req.url} Not found.` });
});

// 500 - Any server error
app.use((error, req, res, next) => {
  req.log.error(error);
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error });
});

app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
