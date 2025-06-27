const { getPool } = require("../utils/database");
const NotFoundError = require("../exceptions/NotFoundError");

class BaseService {
  constructor() {
    this._pool = getPool();
  }

  async executeQuery(query) {
    return this._pool.query(query);
  }

  async findById(table, id, errorMessage = "Data tidak ditemukan") {
    const query = {
      text: `SELECT * FROM ${table} WHERE id = $1`,
      values: [id],
    };

    const result = await this.executeQuery(query);

    if (!result.rows.length) {
      throw new NotFoundError(errorMessage);
    }

    return result.rows[0];
  }

  async create(table, data) {
    const keys = Object.keys(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");
    const columns = keys.join(", ");

    const query = {
      text: `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING id`,
      values: Object.values(data),
    };

    const result = await this.executeQuery(query);
    return result.rows[0].id;
  }

  async update(
    table,
    id,
    data,
    errorMessage = "Data gagal diperbarui. Id tidak ditemukan"
  ) {
    const keys = Object.keys(data);
    const setClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const query = {
      text: `UPDATE ${table} SET ${setClause} WHERE id = $${
        keys.length + 1
      } RETURNING id`,
      values: [...Object.values(data), id],
    };

    const result = await this.executeQuery(query);

    if (!result.rows.length) {
      throw new NotFoundError(errorMessage);
    }
  }

  async delete(
    table,
    id,
    errorMessage = "Data gagal dihapus. Id tidak ditemukan"
  ) {
    const query = {
      text: `DELETE FROM ${table} WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const result = await this.executeQuery(query);

    if (!result.rows.length) {
      throw new NotFoundError(errorMessage);
    }
  }
}

module.exports = BaseService;
