const InvariantError = require("../../exceptions/InvariantError");
// const NotFoundError = require("../../exceptions/NotFoundError");

const { nanoid } = require("nanoid");
const { Pool } = require("pg");
// const { mapAlbumModel } = require("../../utils/mappingModel");

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
}

module.exports = AlbumService;