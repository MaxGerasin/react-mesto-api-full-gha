const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const IncorrectError = require('../errors/incorrectError');
const NotFoundDataError = require('../errors/notFoundDataError');
const ConflictError = require('../errors/conflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        throw new NotFoundDataError('Пользователь по указанному id не найден');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new IncorrectError('Переданы некорректные данные при поиске пользователя'));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundDataError('Пользователь по указанному id не найден');
      }
    })
    .catch(next);
};

const postUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const { ...userCurr } = user.toObject();
      delete userCurr.password;
      res.status(201).send({ data: userCurr });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new IncorrectError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

const patchUser = (req, res, data, next) => {
  User.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new IncorrectError('Переданы некорректные данные при обновлении профиля'));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundDataError('Пользователь с указанным id не найден'));
      } else {
        next(err);
      }
    });
};

const patchUserProfile = (req, res) => {
  const { name, about } = req.body;

  patchUser(req, res, { name, about });
};

const patchUserAvatar = (req, res) => {
  const { avatar } = req.body;

  patchUser(req, res, { avatar });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret', {
          expiresIn: '7d',
        }),
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  postUser,
  patchUserProfile,
  patchUserAvatar,
  login,
};
