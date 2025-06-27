const BaseService = require("../BaseService");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const { nanoid } = require("nanoid");
const { ERROR_MESSAGES } = require("../../utils/constants");

class PlaylistService extends BaseService {
  async addPlaylist({ name, owner }) {
    const id = nanoid(16);

    const playlistData = {
      id,
      name,
      owner,
    };

    try {
      return await this.create("playlists", playlistData);
    } catch {
      throw new InvariantError(ERROR_MESSAGES.PLAYLIST.CREATE_FAILED);
    }
  }

  async getPlaylistsByOwner(owner) {
    const query = {
      text: `SELECT p.id, p.name, u.username 
             FROM playlists p 
             JOIN users u ON u.id = p.owner 
             WHERE p.owner = $1
             UNION
             SELECT p.id, p.name, u.username 
             FROM playlists p 
             JOIN users u ON u.id = p.owner 
             JOIN collaborations c ON c.playlist_id = p.id 
             WHERE c.user_id = $1`,
      values: [owner],
    };

    const result = await this.executeQuery(query);
    return result.rows;
  }

  async deletePlaylist(id) {
    await this.delete("playlists", id, ERROR_MESSAGES.PLAYLIST.DELETE_FAILED);
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };

    const result = await this.executeQuery(query);

    if (!result.rows.length) {
      throw new NotFoundError(ERROR_MESSAGES.PLAYLIST.NOT_FOUND);
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistAccess(id, userId) {
    const playlistQuery = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };

    const playlistResult = await this.executeQuery(playlistQuery);

    if (!playlistResult.rows.length) {
      throw new NotFoundError(ERROR_MESSAGES.PLAYLIST.NOT_FOUND);
    }

    const accessQuery = {
      text: `SELECT * FROM playlists WHERE id = $1 AND (owner = $2 OR id IN (
               SELECT playlist_id FROM collaborations WHERE user_id = $2
             ))`,
      values: [id, userId],
    };

    const accessResult = await this.executeQuery(accessQuery);

    if (!accessResult.rows.length) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = nanoid(16);

    const playlistSongData = {
      id,
      playlist_id: playlistId,
      song_id: songId,
    };

    try {
      return await this.create("playlist_songs", playlistSongData);
    } catch {
      throw new InvariantError(ERROR_MESSAGES.PLAYLIST.ADD_SONG_FAILED);
    }
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `SELECT s.id, s.title, s.performer 
             FROM songs s
             INNER JOIN playlist_songs ps ON s.id = ps.song_id
             WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this.executeQuery(query);
    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const result = await this.executeQuery(query);

    if (!result.rows.length) {
      throw new InvariantError(ERROR_MESSAGES.PLAYLIST.REMOVE_SONG_FAILED);
    }
  }

  async getPlaylistById(id) {
    const playlist = await this.findById(
      "playlists",
      id,
      ERROR_MESSAGES.PLAYLIST.NOT_FOUND
    );

    const userQuery = {
      text: "SELECT username FROM users WHERE id = $1",
      values: [playlist.owner],
    };

    const userResult = await this.executeQuery(userQuery);

    return {
      id: playlist.id,
      name: playlist.name,
      username: userResult.rows[0].username,
    };
  }

  async getPlaylistForExport(id) {
    const playlist = await this.findById(
      "playlists",
      id,
      ERROR_MESSAGES.PLAYLIST.NOT_FOUND
    );

    const songsQuery = {
      text: `SELECT s.id, s.title, s.performer
             FROM songs s
             JOIN playlist_songs ps ON s.id = ps.song_id
             WHERE ps.playlist_id = $1`,
      values: [id],
    };

    const songsResult = await this.executeQuery(songsQuery);

    return {
      playlist: {
        id: playlist.id,
        name: playlist.name,
        songs: songsResult.rows,
      },
    };
  }

  async verifySongExists(songId) {
    const query = {
      text: "SELECT id FROM songs WHERE id = $1",
      values: [songId],
    };

    const result = await this.executeQuery(query);

    if (!result.rows.length) {
      throw new NotFoundError(ERROR_MESSAGES.SONG.NOT_FOUND);
    }
  }
}

module.exports = PlaylistService;
