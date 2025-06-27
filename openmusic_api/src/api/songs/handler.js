const ResponseFormatter = require("../../utils/ResponseFormatter");
const { SUCCESS_MESSAGES } = require("../../utils/constants");

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getAllSongsHandler = this.getAllSongsHandler.bind(this);
    this.getDetailSongHandler = this.getDetailSongHandler.bind(this);
    this.putSongHandler = this.putSongHandler.bind(this);
    this.deleteSongHandler = this.deleteSongHandler.bind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const { title, year, performer, genre, duration, albumId } =
      request.payload;

    const id = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    const response = h.response(
      ResponseFormatter.created({ songId: id }, SUCCESS_MESSAGES.SONG.CREATED)
    );
    response.code(201);
    return response;
  }

  async getAllSongsHandler(request) {
    const { title, performer } = request.query;

    const songs = await this._service.getAllSongs({ title, performer });

    return ResponseFormatter.success({ songs });
  }

  async getDetailSongHandler(request) {
    const { id } = request.params;

    const song = await this._service.getDetailSong(id);

    return ResponseFormatter.success({ song });
  }

  async putSongHandler(request) {
    this._validator.validateSongPayload(request.payload);

    const { id } = request.params;

    await this._service.editSong(id, request.payload);

    return ResponseFormatter.success(null, SUCCESS_MESSAGES.SONG.UPDATED);
  }

  async deleteSongHandler(request) {
    const { id } = request.params;

    await this._service.deleteSong(id);

    return ResponseFormatter.success(null, SUCCESS_MESSAGES.SONG.DELETED);
  }
}

module.exports = SongHandler;
