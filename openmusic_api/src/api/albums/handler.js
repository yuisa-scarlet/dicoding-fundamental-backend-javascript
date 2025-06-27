const ResponseFormatter = require("../../utils/ResponseFormatter");
const { SUCCESS_MESSAGES } = require("../../utils/constants");

class AlbumHandler {
  constructor(service, validator, storageService, cacheService) {
    this._service = service;
    this._validator = validator;
    this._storageService = storageService;
    this._cacheService = cacheService;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getDetailAlbumHandler = this.getDetailAlbumHandler.bind(this);
    this.putAlbumHandler = this.putAlbumHandler.bind(this);
    this.deleteAlbumHandler = this.deleteAlbumHandler.bind(this);
    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.deleteAlbumLikeHandler = this.deleteAlbumLikeHandler.bind(this);
    this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this);
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

  async postAlbumLikeHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.likeAlbum(id, credentialId);

    await this._cacheService.delete(`album:likes:${id}`);

    const response = h.response(
      ResponseFormatter.success(null, SUCCESS_MESSAGES.ALBUM.LIKED)
    );
    response.code(201);
    return response;
  }

  async deleteAlbumLikeHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.unlikeAlbum(id, credentialId);

    await this._cacheService.delete(`album:likes:${id}`);

    return ResponseFormatter.success(null, SUCCESS_MESSAGES.ALBUM.UNLIKED);
  }

  async getAlbumLikesHandler(request, h) {
    const { id } = request.params;

    try {
      const result = await this._cacheService.get(`album:likes:${id}`);
      const likes = JSON.parse(result);

      const response = h.response(ResponseFormatter.success({ likes }));
      response.header("X-Data-Source", "cache");
      return response;
    } catch {
      const likes = await this._service.getAlbumLikes(id);

      await this._cacheService.set(
        `album:likes:${id}`,
        JSON.stringify(likes),
        1800
      );

      const response = h.response(ResponseFormatter.success({ likes }));
      response.header("X-Data-Source", "database");
      return response;
    }
  }
}

module.exports = AlbumHandler;
