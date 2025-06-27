const BaseService = require("../BaseService");
const InvariantError = require("../../exceptions/InvariantError");
const { nanoid } = require("nanoid");
const { ERROR_MESSAGES } = require("../../utils/constants");
const NotFoundError = require("../../exceptions/NotFoundError");

class CollaborationService extends BaseService {
  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const userQuery = {
      text: "SELECT id FROM users WHERE id = $1",
      values: [userId],
    };

    const userResult = await this.executeQuery(userQuery);
    if (!userResult.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    const query = {
      text: "INSERT INTO collaborations (id, playlist_id, user_id) VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, userId],
    };

    const result = await this.executeQuery(query);

    if (!result.rows[0].id) {
      throw new InvariantError(ERROR_MESSAGES.COLLABORATION.CREATE_FAILED);
    }

    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: "DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id",
      values: [playlistId, userId],
    };

    const result = await this.executeQuery(query);

    if (!result.rows.length) {
      throw new InvariantError("Kolaborasi tidak ditemukan");
    }
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: "SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlistId, userId],
    };

    const result = await this.executeQuery(query);

    if (!result.rows.length) {
      throw new InvariantError("Kolaborasi tidak valid");
    }
  }
}

module.exports = CollaborationService;
