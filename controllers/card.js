const Card = require('../models/card');

const { SUCCESS_OK_CODE, SUCCESS_CREATED_CODE } = require('../utils/constants');

const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const InternalServerError = require('../errors/internal-server-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(SUCCESS_OK_CODE).send(cards))
    .catch(() => {
      next(new InternalServerError('Произошла ошибка'));
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.status(SUCCESS_CREATED_CODE).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }

      if (error.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже существует'));
        return;
      }

      next(new InternalServerError('Произошла ошибка'));
    });
};

const deleteCard = (req, res, next) => {
  const _id = req.params.cardId;
  Card.findById(_id)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }

      if (card.owner._id.toString() !== req.user._id) {
        next(new ForbiddenError('Доступ запрещён'));
        return;
      }

      Card.findByIdAndRemove(_id)
        .populate(['owner', 'likes'])
        .then(() => {
          res.status(SUCCESS_OK_CODE).send(card);
        });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Карточка не найдена'));
        return;
      }

      next(new InternalServerError('Произошла ошибка'));
    });
};

const likeCard = (req, res, next) => {
  const _id = req.params.cardId;

  Card.findByIdAndUpdate(_id, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }

      res.status(SUCCESS_OK_CODE).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Карточка не найдена'));
        return;
      }

      next(new InternalServerError('Произошла ошибка'));
    });
};

const dislikeCard = (req, res, next) => {
  const _id = req.params.cardId;

  Card.findByIdAndUpdate(_id, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }

      res.status(SUCCESS_OK_CODE).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Карточка не найдена'));
        return;
      }

      next(new InternalServerError('Произошла ошибка'));
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
