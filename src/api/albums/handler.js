const ResponseFormatter = require("../../utils/ResponseFormatter");
const { SUCCESS_MESSAGES } = require("../../utils/constants");

class AlbumHandler {
  constructor(service, validator, storageService) {
    this._service = service;
    this._validator = validator;
    this._storageService = storageService;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getDetailAlbumHandler = this.getDetailAlbumHandler.bind(this);
    this.putAlbumHandler = this.putAlbumHandler.bind(this);
    this.deleteAlbumHandler = this.deleteAlbumHandler.bind(this);
    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
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

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/${filename}`;

    await this._service.editAlbum(id, { coverUrl });

    const response = h.response(
      ResponseFormatter.success(null, "Sampul berhasil diunggah")
    );
    response.code(201);
    return response;
  }
}

module.exports = AlbumHandler;
