const mongoose = require('mongoose');
const Card = require('../models/card');
const IncorrectError = require('../errors/incorrectError');
const ForbiddenError = require('../errors/forbiddenError');
const NotFoundDataError = require('../errors/notFoundDataError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const postCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new IncorrectError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        const owner = card.owner.toString();

        if (owner !== req.user._id) {
          throw new ForbiddenError('У вас нет доступа');
        } else {
          return Card.findByIdAndRemove(req.params.cardId);
        }
      } else {
        throw new NotFoundDataError('Карточка с указанным id не найдена');
      }
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new IncorrectError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const putLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundDataError('Передан несуществующий id карточки');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new IncorrectError('Переданы некорректные данные для установки лайка'));
      } else {
        next(err);
      }
    });
};

const deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundDataError('Передан несуществующий id карточки');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(
          new IncorrectError('Переданы некорректные данные для удаления лайка'),
        );
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  putLikeCard,
  deleteLikeCard,
};
