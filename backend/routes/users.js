const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUsers,
  getUser,
  getCurrentUser,
  patchUserProfile,
  patchUserAvatar,
} = require('../controllers/users');
const { LINK_REG_EXP } = require('../const');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24).hex(),
    }),
  }),
  getUser,
);
router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  patchUserProfile,
);
router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().regex(LINK_REG_EXP),
    }),
  }),
  patchUserAvatar,
);

module.exports = router;
