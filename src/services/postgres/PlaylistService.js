const BaseService = require("../BaseService");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const { nanoid } = require("nanoid");
const { ERROR_MESSAGES } = require("../../utils/constants");

class PlaylistService extends BaseService {
  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const playlistData = {
      id,
      name,
      owner
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
             WHERE p.owner = $1`,
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
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this.executeQuery(query);

    if (!result.rows.length) {
      throw new NotFoundError(ERROR_MESSAGES.PLAYLIST.NOT_FOUND);
    }

    const playlist = result.rows[0];    

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlistsong-${nanoid(16)}`;
    
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
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this.executeQuery(query);

    if (!result.rows.length) {
      throw new InvariantError(ERROR_MESSAGES.PLAYLIST.REMOVE_SONG_FAILED);
    }
  }

  async getPlaylistById(id) {
    const playlist = await this.findById("playlists", id, ERROR_MESSAGES.PLAYLIST.NOT_FOUND);
    
    const userQuery = {
      text: 'SELECT username FROM users WHERE id = $1',
      values: [playlist.owner],
    };
    
    const userResult = await this.executeQuery(userQuery);
    
    return {
      id: playlist.id,
      name: playlist.name,
      username: userResult.rows[0].username,
    };
  }

  async verifySongExists(songId) {
    const query = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };

    const result = await this.executeQuery(query);

    if (!result.rows.length) {
      throw new NotFoundError(ERROR_MESSAGES.SONG.NOT_FOUND);
    }
  }
}

module.exports = PlaylistService;