const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const { PORT = 3000 } = process.env;

const VALIDATION_ERROR_CODE = 400;
const DOCUMENT_NOT_FOUND_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

module.exports = {
  VALIDATION_ERROR_CODE,
  DOCUMENT_NOT_FOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(helmet());

app.use(limiter);

app.use((req, res, next) => {
  req.user = {
    _id: '639ffc92daed05d442ee4040',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(DOCUMENT_NOT_FOUND_ERROR_CODE).send({ message: 'Указан неправильный путь' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
