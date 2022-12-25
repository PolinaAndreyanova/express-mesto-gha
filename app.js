const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');

const { login, createUser } = require('./controllers/user');

const { checkAuth } = require('./middlewares/auth');

const { NOT_FOUND_ERROR_CODE } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

app.use('/users', checkAuth, userRouter);

app.use('/cards', checkAuth, cardRouter);

app.post('/signin', login);
app.post('/signup', createUser);

app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Путь не найден' });
});

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});

mongoose.connect('mongodb://127.0.0.1/mestodb', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB!');

    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
