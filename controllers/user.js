const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { SUCCESS_OK_CODE, SUCCESS_CREATED_CODE } = require('../utils/constants');

const BadRequestError = require('../errors/bad-request-error');
const InternalServerError = require('../errors/internal-server-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(SUCCESS_OK_CODE).send(users))
    .catch(() => {
      throw new InternalServerError('Произошла ошибка');
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const _id = req.params.userId;

  User.findById(_id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.status(SUCCESS_OK_CODE).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequestError('Пользователь не найден');
      }

      throw new InternalServerError('Произошла ошибка');
    })
    .catch(next);
};

const getMe = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.status(SUCCESS_OK_CODE).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequestError('Пользователь не найден');
      }

      throw new InternalServerError('Произошла ошибка');
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    })
      .then((user) => res.status(SUCCESS_CREATED_CODE).send(user))
      .catch((error) => {
        if (error.name === 'ValidationError') {
          throw new BadRequestError('Переданы некорректные данные');
        }

        throw new InternalServerError('Произошла ошибка');
      })
      .catch(next));
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.status(SUCCESS_OK_CODE).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }

      throw new InternalServerError('Произошла ошибка');
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь не найден');
      }

      res.status(SUCCESS_OK_CODE).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }

      throw new InternalServerError('Произошла ошибка');
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (user === null) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          const token = jwt.sign({ _id: user._id }, 'secret-token-key', { expiresIn: '7d' });

          res.status(SUCCESS_OK_CODE).send({ jwt: token });
        });
    })
    .catch(() => {
      throw new InternalServerError('Произошла ошибка');
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  getMe,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
};
