const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: [`http://localhost:${PORT}`, 'https://e-baron.github.io'],
};

const app = express();

require('./websockets/websockets');

const usersRouter = require('./routes/users');
const pizzaRouter = require('./routes/pizzas');
const authsRouter = require('./routes/auths');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors(corsOptions));

app.use('/users', usersRouter);
app.use('/pizzas', pizzaRouter);
app.use('/auths', authsRouter);

module.exports = app;
