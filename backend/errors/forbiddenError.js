const { codesError } = require('../const');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = codesError.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
