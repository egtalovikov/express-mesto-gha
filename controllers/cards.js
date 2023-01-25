const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const ForbiddenError = require('../errors/forbidden-err');

const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалить карточку другого пользователя');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Карточка с  указанным _id не найдена'));
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: {
        likes: req.user._id,
      },
    },
    {
      new: true,
    },
  )
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные для постановки/снятии лайка'));
      }
      if (err.name === 'CastError') {
        next(new ValidationError('Передан несуществующий _id карточки'));
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $pull: {
      likes: req.user._id,
    },
  }, { new: true })
    .orFail(new NotFoundError('Передан несуществующий _id карточки'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные для постановки/снятии лайка'));
      }
      if (err.name === 'CastError') {
        next(new ValidationError('Передан несуществующий _id карточки'));
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
