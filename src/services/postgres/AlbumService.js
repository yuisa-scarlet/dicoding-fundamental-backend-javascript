const BaseService = require("../BaseService");
const InvariantError = require("../../exceptions/InvariantError");
const { nanoid } = require("nanoid");
const { mapAlbumModel, mapSongModel } = require("../../utils/mappingModel");
const { ERROR_MESSAGES } = require("../../utils/constants");

class AlbumService extends BaseService {
  async addAlbum({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();

    const albumData = {
      id,
      name,
      year,
      created_at: createdAt,
      updated_at: createdAt,
    };

    try {
      return await this.create("albums", albumData);
    } catch {
      throw new InvariantError(ERROR_MESSAGES.ALBUM.CREATE_FAILED);
    }
  }

  async getDetailAlbum(id) {
    const album = await this.findById(
      "albums",
      id,
      ERROR_MESSAGES.ALBUM.NOT_FOUND
    );
    const mappedAlbum = mapAlbumModel(album);

    const songsQuery = {
      text: "SELECT id, title, performer FROM songs WHERE album_id = $1",
      values: [id],
    };

    const songsResult = await this.executeQuery(songsQuery);
    mappedAlbum.songs = songsResult.rows.map(mapSongModel);

    return mappedAlbum;
  }

  async editAlbum(id, { name, year }) {
    const updateData = {
      name,
      year,
      updated_at: new Date().toISOString(),
    };

    await this.update(
      "albums",
      id,
      updateData,
      ERROR_MESSAGES.ALBUM.UPDATE_FAILED
    );
  }

  async deleteAlbum(id) {
    await this.delete("albums", id, ERROR_MESSAGES.ALBUM.DELETE_FAILED);
  }
}

module.exports = AlbumService;
