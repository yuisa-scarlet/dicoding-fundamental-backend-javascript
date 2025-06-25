const joi = require("joi");

const LoginPayloadSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
});

const UpdateRefreshTokenPayloadSchema = joi.object({
  refreshToken: joi.string().required(),
})

const RemoveRefreshTokenPayloadSchema = joi.object({
  refreshToken: joi.string().required(),
});

module.exports = {
  LoginPayloadSchema,
  UpdateRefreshTokenPayloadSchema,
  RemoveRefreshTokenPayloadSchema,
};