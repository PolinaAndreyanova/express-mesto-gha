const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const getUser = (req, res) => {
  const { _id } = req.params;

  User.findById(_id)
    .then((user) => {
      if (user === null) res.status(404).send({ message: 'Пользователь не найден' });

      res.status(200).send(user);
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch(res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
