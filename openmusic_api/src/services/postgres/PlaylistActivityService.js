const BaseService = require("../BaseService");
const { nanoid } = require("nanoid");

class PlaylistActivityService extends BaseService {
  async addActivity(playlistId, userId, songId, action) {
    const id = `activity-${nanoid(16)}`;

    const activityData = {
      id,
      playlist_id: playlistId,
      user_id: userId,
      song_id: songId,
      action,
    };

    await this.create("playlist_activities", activityData);
    return id;
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT u.username, s.title, pa.action, pa.time
             FROM playlist_activities pa
             JOIN users u ON u.id = pa.user_id
             JOIN songs s ON s.id = pa.song_id
             WHERE pa.playlist_id = $1
             ORDER BY pa.time ASC`,
      values: [playlistId],
    };

    const result = await this.executeQuery(query);
    return result.rows;
  }
}

module.exports = PlaylistActivityService;
