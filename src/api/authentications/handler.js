const ResponseFormatter = require("../../utils/ResponseFormatter");
const { SUCCESS_MESSAGES } = require("../../utils/constants");

class AuthenticationHandler {
  constructor(authenticationService, userService, tokenManager, validator) {
    this._authenticationService = authenticationService;
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.loginHandler = this.loginHandler.bind(this);
    this.updateRefreshTokenHandler = this.updateRefreshTokenHandler.bind(this);
    this.deleteRefreshTokenHandler = this.deleteRefreshTokenHandler.bind(this);
  }

  async loginHandler(request, h) {
    this._validator.validateLoginPayload(request.payload);

    const { username, password } = request.payload;
    const id = await this._userService.verifyUserCredential(
      username,
      password
    );

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationService.addRefreshToken(refreshToken);

    const response = h.response(
      ResponseFormatter.created(
        { accessToken, refreshToken },
        SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS
      )
    );
    response.code(201);
    return response;
  }

  async updateRefreshTokenHandler(request, h) {
    this._validator.validateUpdateRefreshTokenPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._authenticationService.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ id });

    const response = h.response(
      ResponseFormatter.success(
        { accessToken },
        SUCCESS_MESSAGES.AUTH.REFRESH_TOKEN_UPDATED
      )
    );

    return response;
  }

  async deleteRefreshTokenHandler(request, h) {
    this._validator.validateRemoveRefreshTokenPayload(request.payload);

    const { refreshToken } = request.payload;
    const result = await this._authenticationService.verifyRefreshToken(refreshToken);
    await this._authenticationService.deleteRefreshToken(result.id);

    const response = h.response(
      ResponseFormatter.success(
        null,
        SUCCESS_MESSAGES.AUTH.REFRESH_TOKEN_DELETED
      )
    );
    return response;
  }
}

module.exports = AuthenticationHandler;
