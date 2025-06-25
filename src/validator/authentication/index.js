const InvariantError = require("../../exceptions/InvariantError");
const {
  LoginPayloadSchema,
  UpdateRefreshTokenPayloadSchema,
  RemoveRefreshTokenPayloadSchema,
} = require("./schema");

const AuthenticationValidator = {
  validateLoginPayload: (payload) => {
    const validationResult = LoginPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateUpdateRefreshTokenPayload: (payload) => {
    const validationResult = UpdateRefreshTokenPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateRemoveRefreshTokenPayload: (payload) => {
    const validationResult = RemoveRefreshTokenPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationValidator;