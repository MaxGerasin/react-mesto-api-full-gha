const codesError = {
  INCORRECT_DATA: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND_DATA: 404,
  CONFLICT: 409,
  DEFAULT: 500,
};

const LINK_REG_EXP = /^https?:\/\/(www\.)?[\w\-._~:/?#[\]@!$&'()*+,;=]{2,}\.[a-zA-Z0-9./?#-]{2,}#?$/;

module.exports = { codesError, LINK_REG_EXP };
