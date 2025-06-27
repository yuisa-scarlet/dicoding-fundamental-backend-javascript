const mapAlbumModel = ({
  id,
  name,
  year,
  cover_url,
  created_at,
  updated_at,
}) => ({
  id,
  name,
  year,
  coverUrl: cover_url || null,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapSongModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = {
  mapAlbumModel,
  mapSongModel,
};
