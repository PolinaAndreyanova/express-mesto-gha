const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }

      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  const _id = req.params.cardId;

  Card.findByIdAndRemove(_id)
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }

      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Карточка не найдена' });
        return;
      }

      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  const _id = req.params.cardId;

  Card.findByIdAndUpdate(_id, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }

      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Карточка не найдена' });
        return;
      }

      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  const _id = req.params.cardId;

  Card.findByIdAndUpdate(_id, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }

      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'Карточка не найдена' });
        return;
      }

      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
