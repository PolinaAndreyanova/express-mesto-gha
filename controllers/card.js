const Card = require('../models/card');

const { SUCCESS_OK_CODE, SUCCESS_CREATED_CODE } = require('../utils/constants');

const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const InternalServerError = require('../errors/internal-server-error');
const NotFoundError = require('../errors/not-found-error');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(SUCCESS_OK_CODE).send(cards))
    .catch(() => {
      throw new InternalServerError('Произошла ошибка');
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.status(SUCCESS_CREATED_CODE).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }

      throw new InternalServerError('Произошла ошибка');
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const _id = req.params.cardId;
  Card.findById(_id)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }

      if (card.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError('Доступ запрещён');
      }

      Card.findByIdAndRemove(_id)
        .populate(['owner', 'likes'])
        .then(() => {
          res.status(SUCCESS_OK_CODE).send(card);
        });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequestError('Карточка не найдена');
      }

      throw new InternalServerError('Произошла ошибка');
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const _id = req.params.cardId;

  Card.findByIdAndUpdate(_id, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }

      res.status(SUCCESS_OK_CODE).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequestError('Карточка не найдена');
      }

      throw new InternalServerError('Произошла ошибка');
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const _id = req.params.cardId;

  Card.findByIdAndUpdate(_id, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }

      res.status(SUCCESS_OK_CODE).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequestError('Карточка не найдена');
      }

      throw new InternalServerError('Произошла ошибка');
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
