require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const otherRouter = require('./routes/other');
const authRouter = require('./routes/auth');
const authMiddleware = require('./middlewares/auth');
const errorsMiddleware = require('./middlewares/errors');
const corsMiddleware = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  family: 4,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(corsMiddleware);

app.use(requestLogger);

app.use(authRouter);

app.use(authMiddleware);
app.use(userRouter);
app.use(cardRouter);
app.use(otherRouter);

app.use(errorLogger);

app.use(errors());
app.use(errorsMiddleware);

app.listen(PORT);
