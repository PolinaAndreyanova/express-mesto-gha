const Card = require('../models/card');
const {
  SUCCESS_OK_CODE,
  SUCCESS_CREATED_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(SUCCESS_OK_CODE).send(cards))
    .catch(() => res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.status(SUCCESS_CREATED_CODE).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
        return;
      }

      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  const _id = req.params.cardId;

  Card.findByIdAndRemove(_id)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка не найдена' });
        return;
      }

      res.status(SUCCESS_OK_CODE).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Карточка не найдена' });
        return;
      }

      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  const _id = req.params.cardId;

  Card.findByIdAndUpdate(_id, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка не найдена' });
        return;
      }

      res.status(SUCCESS_OK_CODE).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Карточка не найдена' });
        return;
      }

      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  const _id = req.params.cardId;

  Card.findByIdAndUpdate(_id, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка не найдена' });
        return;
      }

      res.status(SUCCESS_OK_CODE).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Карточка не найдена' });
        return;
      }

      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
