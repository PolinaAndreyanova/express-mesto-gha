const User = require('../models/user');
const {
  SUCCESS_OK_CODE,
  SUCCESS_CREATED_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(SUCCESS_OK_CODE).send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

const getUser = (req, res) => {
  const _id = req.params.userId;

  User.findById(_id)
    .then((user) => {
      if (user === null) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь не найден' });
        return;
      }

      res.status(SUCCESS_OK_CODE).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Пользователь не найден' });
        return;
      }

      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(SUCCESS_CREATED_CODE).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
        return;
      }

      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь не найден' });
        return;
      }

      res.status(SUCCESS_OK_CODE).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь не найден' });
        return;
      }

      res.status(SUCCESS_OK_CODE).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
        return;
      }

      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
