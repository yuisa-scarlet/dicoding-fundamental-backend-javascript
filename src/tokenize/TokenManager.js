const jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken(payload) {
    return jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  },

  generateRefreshToken(payload) {
    return jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY);
  },

  verifyRefreshToken(refreshToken) {
    try {
      const artifacts = jwt.token.decode(refreshToken);
      jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);

      const {payload} = artifacts.decoded;
      return payload;
    } catch {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};
 
module.exports = TokenManager;