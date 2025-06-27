/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("playlist_activities", {
    id: {
      type: "VARCHAR(32)",
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(32)",
      references: '"playlists"',
      onDelete: "cascade",
      notNull: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      references: '"users"',
      onDelete: "cascade",
      notNull: true,
    },
    song_id: {
      type: "VARCHAR(32)",
      references: '"songs"',
      onDelete: "cascade",
      notNull: true,
    },
    action: {
      type: "VARCHAR(10)",
      notNull: true,
    },
    time: {
      type: "TIMESTAMP",
      default: pgm.func("current_timestamp"),
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("playlist_activities");
};
