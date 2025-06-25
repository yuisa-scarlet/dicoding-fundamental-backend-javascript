const BaseService = require("../BaseService");
const InvariantError = require("../../exceptions/InvariantError");
const bcrypt = require('bcrypt');
const { nanoid } = require("nanoid");

class UserService extends BaseService {
  async addUser({ username, password, fullname }) {
    await this.verifyUsername(username);
    
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      id,
      username,
      password: hashedPassword,
      fullname,
      created_at: createdAt,
      updated_at: createdAt,
    };

    try {
      return await this.create("users", userData);
    } catch {
      throw new InvariantError('Gagal menambahkan user. Terjadi kesalahan pada server.');
    }
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);
 
    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }
}

module.exports = UserService;