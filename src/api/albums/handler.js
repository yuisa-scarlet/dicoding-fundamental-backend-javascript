const ResponseFormatter = require("../../utils/ResponseFormatter");
const { SUCCESS_MESSAGES } = require("../../utils/constants");

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getDetailAlbumHandler = this.getDetailAlbumHandler.bind(this);
    this.putAlbumHandler = this.putAlbumHandler.bind(this);
    this.deleteAlbumHandler = this.deleteAlbumHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response(
      ResponseFormatter.created({ albumId }, SUCCESS_MESSAGES.ALBUM.CREATED)
    );

    response.code(201);
    return response;
  }

  async getDetailAlbumHandler(request) {
    const { id } = request.params;

    const album = await this._service.getDetailAlbum(id);

    return ResponseFormatter.success({ album });
  }

  async putAlbumHandler(request) {
    this._validator.validateAlbumPayload(request.payload);

    const { id } = request.params;

    await this._service.editAlbum(id, request.payload);

    return ResponseFormatter.success(null, SUCCESS_MESSAGES.ALBUM.UPDATED);
  }

  async deleteAlbumHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbum(id);

    return ResponseFormatter.success(null, SUCCESS_MESSAGES.ALBUM.DELETED);
  }
}

module.exports = AlbumHandler;
