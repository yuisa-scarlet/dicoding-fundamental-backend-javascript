const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const { mapAlbumModel } = require("../../utils/mappingModel");
const { mapSongModel } = require("../../utils/mappingModel");

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    }

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getDetailAlbum(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    }
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const album = result.rows.map(mapAlbumModel)[0];

    const songsQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    }
    const songsResult = await this._pool.query(songsQuery);

    album.songs = songsResult.rows.map(mapSongModel);

    return album;
  }

  async editAlbum(id, { name, year }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album gagal diperbarui. Id tidak ditemukan");
    }
  }

  async deleteAlbum(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = AlbumService;