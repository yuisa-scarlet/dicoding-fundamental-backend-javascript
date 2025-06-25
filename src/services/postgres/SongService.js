const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const { mapSongModel } = require("../../utils/mappingModel");

const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const data = [
      id,
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
      createdAt,
      updatedAt,
    ];

    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      values: data,
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }

    return result.rows[0].id;
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

    const result = await this._pool.query({
      text: query,
      values: queryParams,
    });

    return result.rows.map(mapSongModel);
  }

  async getDetailSong(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    const song = result.rows.map(mapSongModel)[0];

    return song;
  }

  async editSong(id, { title, year, genre, performer, duration, albumId }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: "UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id",
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Lagu gagal diperbarui. Id tidak ditemukan");
		}
  }

	async deleteSong(id) {
		const query = {
			text: "DELETE FROM songs WHERE id = $1 RETURNING id",
			values: [id],
		};
		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Lagu gagal dihapus. Id tidak ditemukan");
		}
	}
}

module.exports = SongService;
