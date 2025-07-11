const ResponseFormatter = require("../../utils/ResponseFormatter");
const { SUCCESS_MESSAGES } = require("../../utils/constants");

class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);

    const { username, password, fullname } = request.payload;

    const id = await this._service.addUser({ username, password, fullname });

    const response = h.response(
      ResponseFormatter.created({ userId: id }, SUCCESS_MESSAGES.USER.CREATED)
    );
    response.code(201);
    return response;
  }
}

module.exports = UserHandler;
