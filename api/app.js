const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// const PORT = process.env.PORT || 8082;

const corsOptions = {
  origin: '*',
};

const app = express();

require('./websockets/websockets');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors(corsOptions));

module.exports = app;
