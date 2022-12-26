const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');

const { login, createUser } = require('./controllers/user');

const { checkAuth } = require('./middlewares/auth');

const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

app.use('/users', checkAuth, userRouter);

app.use('/cards', checkAuth, cardRouter);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(http|https):\/\/(www. |)([\w|-]+)\.([A-z]{2,})/),
  }),
}), createUser);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Путь не найден'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'Произошла ошибка' : message });

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
