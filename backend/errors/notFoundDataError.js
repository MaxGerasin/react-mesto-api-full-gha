const { codesError } = require('../const');

class NotFoundDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = codesError.NOT_FOUND_DATA;
  }
}

module.exports = NotFoundDataError;
