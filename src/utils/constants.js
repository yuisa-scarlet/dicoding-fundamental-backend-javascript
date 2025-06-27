const ERROR_MESSAGES = {
  ALBUM: {
    NOT_FOUND: "Album tidak ditemukan",
    CREATE_FAILED: "Album gagal ditambahkan",
    UPDATE_FAILED: "Album gagal diperbarui. Id tidak ditemukan",
    DELETE_FAILED: "Album gagal dihapus. Id tidak ditemukan",
  },
  SONG: {
    NOT_FOUND: "Lagu tidak ditemukan",
    CREATE_FAILED: "Lagu gagal ditambahkan",
    UPDATE_FAILED: "Lagu gagal diperbarui. Id tidak ditemukan",
    DELETE_FAILED: "Lagu gagal dihapus. Id tidak ditemukan",
  },
  REFRESH_TOKEN: {
    NOT_FOUND: "Refresh token tidak ditemukan",
    CREATE_FAILED: "Refresh token gagal ditambahkan",
    UPDATE_FAILED: "Refresh token gagal diperbarui",
    DELETE_FAILED: "Refresh token gagal dihapus",
  },
  PLAYLIST: {
    NOT_FOUND: "Playlist tidak ditemukan",
    CREATE_FAILED: "Playlist gagal ditambahkan",
    UPDATE_FAILED: "Playlist gagal diperbarui. Id tidak ditemukan",
    DELETE_FAILED: "Playlist gagal dihapus. Id tidak ditemukan",
    ADD_SONG_FAILED: "Lagu gagal ditambahkan ke playlist",
    REMOVE_SONG_FAILED: "Lagu gagal dihapus dari playlist",
  },
  COLLABORATION: {
    CREATE_FAILED: "Kolaborasi gagal ditambahkan",
    DELETE_FAILED: "Kolaborasi gagal dihapus",
  },
};

const SUCCESS_MESSAGES = {
  ALBUM: {
    CREATED: "Album berhasil ditambahkan",
    UPDATED: "Album berhasil diperbarui",
    DELETED: "Album berhasil dihapus",
  },
  SONG: {
    CREATED: "Lagu berhasil ditambahkan",
    UPDATED: "Lagu berhasil diperbarui",
    DELETED: "Lagu berhasil dihapus",
  },
  USER: {
    CREATED: "Akun berhasil dibuat",
    UPDATED: "Akun berhasil diperbarui",
    DELETED: "Akun berhasil dihapus",
  },
  AUTH: {
    LOGIN_SUCCESS: "Berhasil masuk",
    REFRESH_TOKEN_UPDATED: "Refresh token berhasil diperbarui",
    REFRESH_TOKEN_DELETED: "Refresh token berhasil dihapus",
  },
  PLAYLIST: {
    CREATED: "Playlist berhasil ditambahkan",
    UPDATED: "Playlist berhasil diperbarui",
    DELETED: "Playlist berhasil dihapus",
    SONG_ADDED: "Lagu berhasil ditambahkan ke playlist",
    SONG_REMOVED: "Lagu berhasil dihapus dari playlist",
  },
  COLLABORATION: {
    CREATED: "Kolaborasi berhasil ditambahkan",
    DELETED: "Kolaborasi berhasil dihapus",
  },
};

module.exports = {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
