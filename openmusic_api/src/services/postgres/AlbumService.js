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

  async editAlbum(id, { name, year, coverUrl }) {
    const updateData = {
      ...(name && { name }),
      ...(year && { year }),
      ...(coverUrl && { cover_url: coverUrl }),
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

  async likeAlbum(albumId, userId) {
    await this.findById("albums", albumId, ERROR_MESSAGES.ALBUM.NOT_FOUND);

    const checkQuery = {
      text: "SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };

    const checkResult = await this.executeQuery(checkQuery);

    if (checkResult.rows.length > 0) {
      throw new InvariantError("Album sudah disukai sebelumnya");
    }

    const { nanoid } = require("nanoid");
    const id = nanoid(16);

    const insertQuery = {
      text: "INSERT INTO user_album_likes VALUES($1, $2, $3)",
      values: [id, userId, albumId],
    };

    await this.executeQuery(insertQuery);
  }

  async unlikeAlbum(albumId, userId) {
    await this.findById("albums", albumId, ERROR_MESSAGES.ALBUM.NOT_FOUND);

    const deleteQuery = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };

    const result = await this.executeQuery(deleteQuery);

    if (!result.rowCount) {
      throw new InvariantError("Gagal batal menyukai album");
    }
  }

  async getAlbumLikes(albumId) {
    await this.findById("albums", albumId, ERROR_MESSAGES.ALBUM.NOT_FOUND);

    const query = {
      text: "SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1",
      values: [albumId],
    };

    const result = await this.executeQuery(query);
    return parseInt(result.rows[0].count);
  }
}

module.exports = AlbumService;
