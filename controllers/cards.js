const Card = require('../models/card');
const { VALIDATION_ERROR_CODE, DOCUMENT_NOT_FOUND_ERROR_CODE, DEFAULT_ERROR_CODE } = require('../app');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      }

      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        return res.status(DOCUMENT_NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
      }
      res.send(card)}
      )
    .catch(() => res.status(VALIDATION_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена' }));
};

const likeCard = (req, res) => {
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
    .then((card) => {
      if (card === null) {
        return res.status(DOCUMENT_NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
      }
      res.send(card)
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      if (err.name === 'CastError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
      }

      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $pull: {
      likes: req.user._id,
    },
  }, { new: true })
    .then((card) => {
      if (card === null) {
        return res.status(DOCUMENT_NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      if (err.name === 'CastError') {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
      }

      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
