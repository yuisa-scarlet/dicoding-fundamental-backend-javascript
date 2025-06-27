const BaseService = require("../BaseService");
const { nanoid } = require("nanoid");
const { mapSongModel } = require("../../utils/mappingModel");
const InvariantError = require("../../exceptions/InvariantError");
const { ERROR_MESSAGES } = require("../../utils/constants");

class SongService extends BaseService {
  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();

    const songData = {
      id,
      title,
      year,
      genre,
      performer,
      duration,
      album_id: albumId,
      created_at: createdAt,
      updated_at: createdAt,
    };

    try {
      return await this.create("songs", songData);
    } catch {
      throw new InvariantError(ERROR_MESSAGES.SONG.CREATE_FAILED);
    }
  }

  async getAllSongs({ title, performer }) {
    let query = "SELECT id, title, performer FROM songs";

    const queryParams = [];
    const conditions = [];
    let paramIndex = 1;

    if (title) {
      conditions.push(`LOWER(title) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${title}%`);
      paramIndex++;
    }

    if (performer) {
      conditions.push(`LOWER(performer) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${performer}%`);
      paramIndex++;
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const result = await this.executeQuery({
      text: query,
      values: queryParams,
    });

    return result.rows.map(mapSongModel);
  }

  async getDetailSong(id) {
    const song = await this.findById(
      "songs",
      id,
      ERROR_MESSAGES.SONG.NOT_FOUND
    );
    return mapSongModel(song);
  }

  async editSong(id, { title, year, genre, performer, duration, albumId }) {
    const updateData = {
      title,
      year,
      genre,
      performer,
      duration,
      album_id: albumId,
      updated_at: new Date().toISOString(),
    };

    await this.update(
      "songs",
      id,
      updateData,
      ERROR_MESSAGES.SONG.UPDATE_FAILED
    );
  }

  async deleteSong(id) {
    await this.delete("songs", id, ERROR_MESSAGES.SONG.DELETE_FAILED);
  }
}

module.exports = SongService;
