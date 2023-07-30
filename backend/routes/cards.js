const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getCards,
  postCard,
  deleteCard,
  putLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');
const { LINK_REG_EXP } = require('../const');

router.get('/cards', getCards);
router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(LINK_REG_EXP),
    }),
  }),
  postCard,
);
router.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }),
  }),
  deleteCard,
);
router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }),
  }),
  putLikeCard,
);
router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().length(24).hex(),
    }),
  }),
  deleteLikeCard,
);

module.exports = router;
