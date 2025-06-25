const ClientError = require('./ClientError');

class AuthenticationError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

module.exports = AuthenticationError;