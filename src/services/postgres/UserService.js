const BaseService = require("../BaseService");
const InvariantError = require("../../exceptions/InvariantError");
const bcrypt = require('bcrypt');
const { nanoid } = require("nanoid");
const AuthenticationError = require("../../exceptions/AuthenticationError");

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

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.executeQuery(query)

    if (!result.rows.length) {
      throw new AuthenticationError('User tidak ditemukan');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return id;
  }
}

module.exports = UserService;