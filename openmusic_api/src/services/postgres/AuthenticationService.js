const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const { ERROR_MESSAGES } = require("../../utils/constants");
const BaseService = require("../BaseService");

class AuthenticationService extends BaseService {
  async addRefreshToken(token) {
    const id = nanoid(16);
    return await this.create("authentications", { id, token });
  }

  async verifyRefreshToken(token) {
    const query = {
      text: "SELECT id, token FROM authentications WHERE token = $1",
      values: [token],
    };
    const result = await this.executeQuery(query);
    if (!result.rows.length) {
      throw new InvariantError(ERROR_MESSAGES.REFRESH_TOKEN.NOT_FOUND);
    }

    return result.rows[0];
  }

  async deleteRefreshToken(token) {
    await this.delete(
      "authentications",
      token,
      ERROR_MESSAGES.REFRESH_TOKEN.DELETE_FAILED
    );
  }
}

module.exports = AuthenticationService;
