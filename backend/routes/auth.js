const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { LINK_REG_EXP } = require('../const');
const { postUser, login } = require('../controllers/users');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().optional().min(2).max(30),
      avatar: Joi.string().optional().regex(LINK_REG_EXP),
      about: Joi.string().optional().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  postUser,
);

module.exports = router;
