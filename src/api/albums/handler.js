class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.deleteAlbumHandler = this.deleteAlbumHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: "success",
      message: "Album berhasil ditambahkan",
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async deleteAlbumHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbum(id);

    return {
      status: "success",
      message: "Album berhasil dihapus",
    }
  }
}

module.exports = AlbumHandler;