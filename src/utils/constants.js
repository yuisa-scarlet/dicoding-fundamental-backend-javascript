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
};

module.exports = {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
