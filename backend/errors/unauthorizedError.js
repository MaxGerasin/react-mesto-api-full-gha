const { codesError } = require('../const');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = codesError.UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
